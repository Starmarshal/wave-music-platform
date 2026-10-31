import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { AlbumArtist, TrackArtist } from './entities/track-artist.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Playlist } from '../playlists/entities/playlist.entity';
import { generateId } from '../shared/object-id';
import { joinArtistNames, slugify } from '../shared/slug';
import {
  serializeAlbum,
  serializeArtist,
  serializePlaylist,
  serializeTrack,
  TRACK_RELATIONS,
} from '../shared/serializers';

export interface ArtistInput {
  name?: string;
  bio?: string;
  photo?: string;
  labelId?: string | null;
}

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async uniqueSlug(
    name: string,
    manager: EntityManager = this.dataSource.manager,
  ) {
    const base = slugify(name);
    let slug = base;
    for (let i = 2; await manager.existsBy(Artist, { slug }); i++) {
      slug = `${base}-${i}`;
    }
    return slug;
  }

  async list(query?: string, labelId?: string) {
    const qb = this.artistRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.label', 'label')
      .orderBy('lower(artist.name)', 'ASC');
    if (query) {
      qb.where('artist.name ILIKE :query', {
        query: `%${query.replace(/[\\%_]/g, '\\$&')}%`,
      });
    }
    if (labelId) qb.andWhere('artist.label_id = :labelId', { labelId });
    const artists = await qb.getMany();
    return artists.map(serializeArtist);
  }

  async findOne(id: string) {
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: { label: true },
    });
    if (!artist) throw new NotFoundException('Артист не найден');
    return artist;
  }

  // Полная карточка артиста: треки, альбомы, плейлисты, статистика за 30 дней
  async getCard(slugOrId: string) {
    const artist = await this.artistRepository.findOne({
      where: [{ slug: slugOrId }, { id: slugOrId }],
      relations: { label: true },
    });
    if (!artist) throw new NotFoundException('Артист не найден');

    const links = await this.dataSource.getRepository(TrackArtist).find({
      where: { artistId: artist.id },
      relations: { track: TRACK_RELATIONS },
    });
    // Свои треки — где артист указан первым, остальные — совместные
    const tracks = links
      .map((link) => link.track)
      .sort((a, b) => b.listens - a.listens);
    const ownTracks = tracks.filter(
      (track) =>
        [...track.trackArtists].sort((a, b) => a.position - b.position)[0]
          ?.artistId === artist.id,
    );
    const featTracks = tracks.filter((track) => !ownTracks.includes(track));

    const albumLinks = await this.dataSource.getRepository(AlbumArtist).find({
      where: { artistId: artist.id },
      relations: {
        album: {
          albumArtists: { artist: true },
          albumTracks: { track: TRACK_RELATIONS },
          comments: true,
        },
      },
    });

    const playlists = await this.dataSource.getRepository(Playlist).find({
      where: { artistId: artist.id, isPublic: true },
      relations: { owner: true, artist: true, playlistTracks: true },
      order: { createdAt: 'DESC' },
    });

    const [stats] = await this.dataSource.query(
      `SELECT count(*)::int AS listens, count(DISTINCT l.user_id)::int AS listeners
       FROM listens l JOIN track_artists ta ON ta.track_id = l.track_id
       WHERE ta.artist_id = $1 AND l.listened_at > now() - interval '30 days'`,
      [artist.id],
    );
    const [{ likes }] = await this.dataSource.query(
      `SELECT count(*)::int AS likes FROM artist_likes WHERE artist_id = $1`,
      [artist.id],
    );

    return {
      ...serializeArtist(artist),
      monthlyListeners: stats.listeners,
      monthlyListens: stats.listens,
      totalListens: tracks.reduce((sum, track) => sum + track.listens, 0),
      likesCount: likes,
      tracks: ownTracks.map((track) => serializeTrack(track)),
      featTracks: featTracks.map((track) => serializeTrack(track)),
      albums: albumLinks.map((link) => serializeAlbum(link.album)),
      playlists: playlists.map((playlist) => serializePlaylist(playlist)),
    };
  }

  // Прослушивания и слушатели по дням за последние N дней
  async dailyStats(artistId: string, days = 30) {
    const rows = await this.dataSource.query(
      `SELECT d::date AS day,
              count(l.id)::int AS listens,
              count(DISTINCT l.user_id)::int AS listeners
       FROM generate_series(current_date - ($2::int - 1), current_date, interval '1 day') d
       LEFT JOIN track_artists ta ON ta.artist_id = $1
       LEFT JOIN listens l ON l.track_id = ta.track_id AND l.listened_at::date = d::date
       GROUP BY d ORDER BY d`,
      [artistId, days],
    );
    return rows.map((row) => ({
      day: row.day,
      listens: row.listens,
      listeners: row.listeners,
    }));
  }

  async create(input: ArtistInput) {
    if (!input.name?.trim())
      throw new BadRequestException('Укажите имя артиста');
    const artist = await this.artistRepository.save(
      this.artistRepository.create({
        id: generateId(),
        name: input.name.trim(),
        slug: await this.uniqueSlug(input.name),
        bio: input.bio ?? '',
        photo: input.photo ?? '',
        labelId: input.labelId ?? null,
      }),
    );
    return this.findOne(artist.id);
  }

  async update(id: string, input: ArtistInput) {
    const artist = await this.findOne(id);
    const patch: Partial<Artist> = {};
    if (input.name?.trim() && input.name.trim() !== artist.name) {
      patch.name = input.name.trim();
      patch.slug = await this.uniqueSlug(patch.name);
    }
    if (input.bio !== undefined) patch.bio = input.bio;
    if (input.photo) patch.photo = input.photo;
    if (input.labelId !== undefined) patch.labelId = input.labelId;
    if (Object.keys(patch).length) {
      await this.artistRepository.update({ id }, patch);
    }
    // Имя могло поменяться — обновляем строку артистов у его треков и альбомов
    await this.refreshDisplayNames(artist.id);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.artistRepository.delete({ id });
  }

  async assertExist(artistIds: string[]) {
    const unique = [...new Set(artistIds)];
    const count = await this.artistRepository.countBy({ id: In(unique) });
    if (!unique.length || count !== unique.length) {
      throw new BadRequestException('Укажите существующих артистов');
    }
    return unique;
  }

  async setTrackArtists(
    trackId: string,
    artistIds: string[],
    manager: EntityManager,
  ) {
    const unique = [...new Set(artistIds)];
    await manager.delete(TrackArtist, { trackId });
    await manager.insert(
      TrackArtist,
      unique.map((artistId, position) => ({ trackId, artistId, position })),
    );
    const artists = await manager.findBy(Artist, { id: In(unique) });
    const names = unique.map((id) => artists.find((a) => a.id === id)!.name);
    await manager.update(
      Track,
      { id: trackId },
      { artist: joinArtistNames(names) },
    );
  }

  async setAlbumArtists(
    albumId: string,
    artistIds: string[],
    manager: EntityManager,
  ) {
    const unique = [...new Set(artistIds)];
    await manager.delete(AlbumArtist, { albumId });
    await manager.insert(
      AlbumArtist,
      unique.map((artistId, position) => ({ albumId, artistId, position })),
    );
    const artists = await manager.findBy(Artist, { id: In(unique) });
    const names = unique.map((id) => artists.find((a) => a.id === id)!.name);
    await manager.update(
      Album,
      { id: albumId },
      { author: joinArtistNames(names) },
    );
  }

  private async refreshDisplayNames(artistId: string) {
    await this.dataSource.transaction(async (manager) => {
      const trackLinks = await manager.findBy(TrackArtist, { artistId });
      for (const { trackId } of trackLinks) {
        const links = await manager.find(TrackArtist, {
          where: { trackId },
          order: { position: 'ASC' },
        });
        await this.setTrackArtists(
          trackId,
          links.map((l) => l.artistId),
          manager,
        );
      }
      const albumLinks = await manager.findBy(AlbumArtist, { artistId });
      for (const { albumId } of albumLinks) {
        const links = await manager.find(AlbumArtist, {
          where: { albumId },
          order: { position: 'ASC' },
        });
        await this.setAlbumArtists(
          albumId,
          links.map((l) => l.artistId),
          manager,
        );
      }
    });
  }
}
