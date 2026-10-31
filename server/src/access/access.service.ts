import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Role, User } from '../users/entities/user.entity';

// Правила владения каталогом: админ управляет всем,
// лейбл — артистами своего лейбла и их треками, альбомами и плейлистами
@Injectable()
export class AccessService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  isAdmin(user?: User | null) {
    return user?.role === Role.ADMIN;
  }

  async labelIdOf(user?: User | null): Promise<string | null> {
    if (!user || user.role !== Role.LABEL) return null;
    const [row] = await this.dataSource.query(
      `SELECT id FROM labels WHERE owner_id = $1`,
      [user.id],
    );
    return row?.id ?? null;
  }

  private forbidden(): never {
    throw new ForbiddenException('Нет прав на управление этим объектом');
  }

  async canManageArtists(user: User | undefined, artistIds: string[]) {
    if (this.isAdmin(user)) return true;
    const labelId = await this.labelIdOf(user);
    if (!labelId || !artistIds.length) return false;
    const [{ count }] = await this.dataSource.query(
      `SELECT count(*)::int AS count FROM artists WHERE id = ANY($1) AND label_id = $2`,
      [artistIds, labelId],
    );
    return count === new Set(artistIds).size;
  }

  async assertCanManageArtists(user: User | undefined, artistIds: string[]) {
    if (!(await this.canManageArtists(user, artistIds))) this.forbidden();
  }

  // Трек принадлежит лейблу, если среди его артистов есть артист этого лейбла
  async canManageTrack(user: User | undefined, trackId: string) {
    if (this.isAdmin(user)) return true;
    const labelId = await this.labelIdOf(user);
    if (!labelId) return false;
    const rows = await this.dataSource.query(
      `SELECT 1 FROM track_artists ta JOIN artists a ON a.id = ta.artist_id
       WHERE ta.track_id = $1 AND a.label_id = $2 LIMIT 1`,
      [trackId, labelId],
    );
    return rows.length > 0;
  }

  async assertCanManageTrack(user: User | undefined, trackId: string) {
    if (!(await this.canManageTrack(user, trackId))) this.forbidden();
  }

  async canManageAlbum(user: User | undefined, albumId: string) {
    if (this.isAdmin(user)) return true;
    const labelId = await this.labelIdOf(user);
    if (!labelId) return false;
    const rows = await this.dataSource.query(
      `SELECT 1 FROM album_artists aa JOIN artists a ON a.id = aa.artist_id
       WHERE aa.album_id = $1 AND a.label_id = $2 LIMIT 1`,
      [albumId, labelId],
    );
    return rows.length > 0;
  }

  async assertCanManageAlbum(user: User | undefined, albumId: string) {
    if (!(await this.canManageAlbum(user, albumId))) this.forbidden();
  }

  // Треки, которые лейбл может класть в альбомы своих артистов
  async assertCanUseTracks(user: User | undefined, trackIds: string[]) {
    if (this.isAdmin(user) || !trackIds.length) return;
    for (const trackId of new Set(trackIds)) {
      await this.assertCanManageTrack(user, trackId);
    }
  }
}
