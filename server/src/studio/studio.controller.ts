import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { Role, User } from '../users/entities/user.entity';
import { AccessService } from '../access/access.service';
import { Label } from '../labels/entities/label.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Playlist } from '../playlists/entities/playlist.entity';
import { ALBUM_RELATIONS } from '../album/album.service';
import { FileService, FileType, IMAGE_LIMITS } from '../file/file.service';
import { AuditService } from '../access/audit.service';
import {
  serializeAlbum,
  serializeArtist,
  serializePlaylist,
  serializeTrack,
  TRACK_RELATIONS,
} from '../shared/serializers';

// «Студия» лейбла: всё, чем он управляет, на одной странице.
// Для админа — весь каталог.
@Controller('/studio')
@Auth({ role: Role.LABEL })
export class StudioController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private accessService: AccessService,
    private fileService: FileService,
    private auditService: AuditService,
  ) {}

  @Get()
  async overview(@CurrentUser() user: User) {
    const isAdmin = this.accessService.isAdmin(user);
    const labelId = await this.accessService.labelIdOf(user);
    const manager = this.dataSource.manager;

    const label = labelId
      ? await manager.findOneBy(Label, { id: labelId })
      : null;
    const artists = await manager.find(Artist, {
      where: isAdmin ? {} : { labelId: labelId ?? '' },
      relations: { label: true },
      order: { name: 'ASC' },
    });
    const artistIds = artists.map((artist) => artist.id);

    const trackIds = artistIds.length
      ? (
          await this.dataSource.query(
            `SELECT DISTINCT track_id FROM track_artists WHERE artist_id = ANY($1)`,
            [artistIds],
          )
        ).map((row) => row.track_id)
      : [];
    const albumIds = artistIds.length
      ? (
          await this.dataSource.query(
            `SELECT DISTINCT album_id FROM album_artists WHERE artist_id = ANY($1)`,
            [artistIds],
          )
        ).map((row) => row.album_id)
      : [];

    const [tracks, albums, playlists, artistStats] = await Promise.all([
      manager.find(Track, {
        where: isAdmin ? {} : { id: In(trackIds) },
        relations: TRACK_RELATIONS,
        order: { createdAt: 'DESC' },
      }),
      manager.find(Album, {
        where: isAdmin ? {} : { id: In(albumIds) },
        relations: ALBUM_RELATIONS,
        order: { createdAt: 'DESC' },
      }),
      manager.find(Playlist, {
        where: { artistId: In(artistIds) },
        relations: { owner: true, artist: true, playlistTracks: true },
      }),
      artistIds.length
        ? this.dataSource.query(
            `SELECT ta.artist_id, count(l.id)::int AS listens, count(DISTINCT l.user_id)::int AS listeners
             FROM track_artists ta JOIN listens l ON l.track_id = ta.track_id
             WHERE ta.artist_id = ANY($1) AND l.listened_at > now() - interval '30 days'
             GROUP BY ta.artist_id`,
            [artistIds],
          )
        : [],
    ]);

    return {
      label: label
        ? {
            _id: label.id,
            name: label.name,
            description: label.description,
            logo: label.logo,
          }
        : null,
      artists: artists.map((artist) => {
        const stats = artistStats.find((row) => row.artist_id === artist.id);
        return {
          ...serializeArtist(artist),
          monthlyListens: stats?.listens ?? 0,
          monthlyListeners: stats?.listeners ?? 0,
        };
      }),
      tracks: tracks.map((track) => serializeTrack(track)),
      albums: albums.map(serializeAlbum),
      playlists: playlists.map((playlist) => serializePlaylist(playlist)),
    };
  }

  @Patch('/label')
  @UseInterceptors(FileInterceptor('logo', { limits: IMAGE_LIMITS }))
  async updateLabel(
    @UploadedFile() logo,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    const labelId = await this.accessService.labelIdOf(user);
    if (!labelId) return { ok: false };
    const patch: Partial<Label> = {};
    if (body.name?.trim()) patch.name = body.name.trim().slice(0, 128);
    if (body.description !== undefined) patch.description = body.description;
    if (logo) patch.logo = this.fileService.createFile(FileType.IMAGE, logo);
    if (Object.keys(patch).length) {
      await this.dataSource.manager.update(Label, { id: labelId }, patch);
    }
    await this.auditService.log(user, 'update', 'label', labelId, {
      name: patch.name,
    });
    return { ok: true };
  }
}
