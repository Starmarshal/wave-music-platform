import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Playlist, PlaylistTrack } from './entities/playlist.entity';
import { Track } from '../track/entities/track.entity';
import { User } from '../users/entities/user.entity';
import { AccessService } from '../access/access.service';
import { generateId } from '../shared/object-id';
import { serializePlaylist, TRACK_RELATIONS } from '../shared/serializers';

const PLAYLIST_RELATIONS = {
  owner: true,
  artist: true,
  playlistTracks: { track: TRACK_RELATIONS },
};

export interface PlaylistInput {
  name?: string;
  description?: string;
  isPublic?: boolean;
  artistId?: string | null;
  cover?: string;
}

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectDataSource() private dataSource: DataSource,
    private accessService: AccessService,
  ) {}

  // Владелец, админ или лейбл артиста, если это официальный плейлист артиста
  async canEdit(playlist: Playlist, user?: User) {
    if (!user) return false;
    if (playlist.ownerId === user.id || this.accessService.isAdmin(user))
      return true;
    return (
      !!playlist.artistId &&
      (await this.accessService.canManageArtists(user, [playlist.artistId]))
    );
  }

  private async load(id: string) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: PLAYLIST_RELATIONS,
    });
    if (!playlist) throw new NotFoundException('Плейлист не найден');
    return playlist;
  }

  private async loadForEdit(id: string, user: User) {
    const playlist = await this.load(id);
    if (!(await this.canEdit(playlist, user))) {
      throw new ForbiddenException('Нет прав на изменение этого плейлиста');
    }
    return playlist;
  }

  async getOne(id: string, user?: User) {
    const playlist = await this.load(id);
    const canEdit = await this.canEdit(playlist, user);
    if (!playlist.isPublic && !canEdit) {
      // Приватный плейлист для чужих выглядит как несуществующий
      throw new NotFoundException('Плейлист не найден');
    }
    return { ...serializePlaylist(playlist, true), canEdit };
  }

  async listOwned(user: User) {
    const playlists = await this.playlistRepository.find({
      where: { ownerId: user.id },
      relations: { owner: true, artist: true, playlistTracks: true },
      order: { updatedAt: 'DESC' },
    });
    return playlists.map((playlist) => serializePlaylist(playlist));
  }

  async listPublic(query?: string) {
    const qb = this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.owner', 'owner')
      .leftJoinAndSelect('playlist.artist', 'artist')
      .leftJoinAndSelect('playlist.playlistTracks', 'playlistTracks')
      .where('playlist.is_public = true')
      .orderBy('playlist.updated_at', 'DESC')
      .take(100);
    if (query) {
      qb.andWhere('playlist.name ILIKE :query', {
        query: `%${query.replace(/[\\%_]/g, '\\$&')}%`,
      });
    }
    const playlists = await qb.getMany();
    return playlists.map((playlist) => serializePlaylist(playlist));
  }

  async create(input: PlaylistInput, user: User) {
    if (!input.name?.trim()) throw new BadRequestException('Укажите название');
    if (input.artistId) {
      await this.accessService.assertCanManageArtists(user, [input.artistId]);
    }
    const id = generateId();
    await this.playlistRepository.insert({
      id,
      ownerId: user.id,
      artistId: input.artistId || null,
      name: input.name.trim(),
      description: input.description ?? '',
      isPublic: input.isPublic ?? false,
      cover: input.cover ?? '',
    });
    return this.getOne(id, user);
  }

  async update(id: string, input: PlaylistInput, user: User) {
    await this.loadForEdit(id, user);
    const patch: Partial<Playlist> = {};
    if (input.name?.trim()) patch.name = input.name.trim();
    if (input.description !== undefined) patch.description = input.description;
    if (input.isPublic !== undefined) patch.isPublic = input.isPublic;
    if (input.cover) patch.cover = input.cover;
    if (Object.keys(patch).length) {
      await this.playlistRepository.update({ id }, patch);
    }
    return this.getOne(id, user);
  }

  async delete(id: string, user: User) {
    const playlist = await this.loadForEdit(id, user);
    await this.playlistRepository.delete({ id });
    return playlist;
  }

  async addTrack(id: string, trackId: string, user: User) {
    await this.loadForEdit(id, user);
    if (
      !(await this.dataSource.getRepository(Track).existsBy({ id: trackId }))
    ) {
      throw new NotFoundException('Трек не найден');
    }
    await this.dataSource.query(
      `INSERT INTO playlist_tracks (playlist_id, track_id, position)
       SELECT $1::varchar, $2::varchar, coalesce(max(position) + 1, 0) FROM playlist_tracks WHERE playlist_id = $1::varchar
       ON CONFLICT DO NOTHING`,
      [id, trackId],
    );
    await this.touch(id);
    return this.getOne(id, user);
  }

  async removeTrack(id: string, trackId: string, user: User) {
    await this.loadForEdit(id, user);
    await this.dataSource
      .getRepository(PlaylistTrack)
      .delete({ playlistId: id, trackId });
    await this.touch(id);
    return this.getOne(id, user);
  }

  // Новый порядок: треки в порядке trackIds, неуказанные — в конце в прежнем порядке
  async reorder(id: string, trackIds: string[], user: User) {
    const playlist = await this.loadForEdit(id, user);
    const current = [...playlist.playlistTracks]
      .sort((a, b) => a.position - b.position)
      .map((playlistTrack) => playlistTrack.trackId);
    const ordered = [
      ...trackIds.filter((trackId) => current.includes(trackId)),
      ...current.filter((trackId) => !trackIds.includes(trackId)),
    ];
    await this.dataSource.transaction(async (manager) => {
      for (const [position, trackId] of [...new Set(ordered)].entries()) {
        await manager.update(
          PlaylistTrack,
          { playlistId: id, trackId },
          { position },
        );
      }
    });
    await this.touch(id);
    return this.getOne(id, user);
  }

  private async touch(id: string) {
    await this.playlistRepository.update({ id }, { updatedAt: new Date() });
  }
}
