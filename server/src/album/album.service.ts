import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { AlbumTrack } from './entities/album-track.entity';
import { FileService, FileType } from '../file/file.service';
import { Comment } from '../track/entities/comment.entity';
import { Track } from '../track/entities/track.entity';
import { ArtistsService } from '../artists/artists.service';
import { User } from '../users/entities/user.entity';
import { generateId } from '../shared/object-id';
import {
  serializeAlbum,
  serializeComment,
  TRACK_RELATIONS,
} from '../shared/serializers';

export const ALBUM_RELATIONS = {
  albumTracks: { track: TRACK_RELATIONS },
  albumArtists: { artist: true },
  comments: { user: true },
};

export interface AlbumInput {
  name?: string;
  artistIds?: string[];
  trackIds?: string[];
}

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectDataSource() private dataSource: DataSource,
    private fileService: FileService,
    private artistsService: ArtistsService,
  ) {}

  async create(input: AlbumInput, picture, user: User) {
    if (!picture) {
      throw new BadRequestException('Picture is required');
    }
    const artistIds = await this.artistsService.assertExist(
      input.artistIds ?? [],
    );
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const albumId = generateId();

    await this.dataSource.transaction(async (manager) => {
      await manager.insert(Album, {
        id: albumId,
        name: input.name ?? '',
        picture: picturePath,
        createdBy: user.id,
      });
      await this.artistsService.setAlbumArtists(albumId, artistIds, manager);
      await this.setTracks(albumId, input.trackIds ?? [], manager);
    });

    return this.getOne(albumId);
  }

  async update(id: string, input: AlbumInput, picture?) {
    if (!(await this.albumRepository.existsBy({ id }))) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    await this.dataSource.transaction(async (manager) => {
      const patch: Partial<Album> = {};
      if (input.name !== undefined) patch.name = input.name;
      if (picture)
        patch.picture = this.fileService.createFile(FileType.IMAGE, picture);
      if (Object.keys(patch).length) await manager.update(Album, { id }, patch);
      if (input.artistIds) {
        const artistIds = await this.artistsService.assertExist(
          input.artistIds,
        );
        await this.artistsService.setAlbumArtists(id, artistIds, manager);
      }
      if (input.trackIds) await this.setTracks(id, input.trackIds, manager);
    });
    return this.getOne(id);
  }

  // Несуществующие и повторяющиеся id треков пропускаем, порядок сохраняем
  private async setTracks(
    albumId: string,
    trackIds: string[],
    manager: EntityManager,
  ) {
    const requestedIds = [...new Set(trackIds)];
    const existing = requestedIds.length
      ? await manager.findBy(Track, { id: In(requestedIds) })
      : [];
    const existingIds = new Set(existing.map((track) => track.id));
    await manager.delete(AlbumTrack, { albumId });
    const albumTracks = requestedIds
      .filter((id) => existingIds.has(id))
      .map((trackId, position) => ({ albumId, trackId, position }));
    if (albumTracks.length) {
      await manager.insert(AlbumTrack, albumTracks);
    }
  }

  async getAll() {
    const albums = await this.albumRepository.find({
      relations: ALBUM_RELATIONS,
      order: { createdAt: 'ASC', id: 'ASC' },
    });
    return albums.map(serializeAlbum);
  }

  async getOne(id: string) {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ALBUM_RELATIONS,
    });
    return album ? serializeAlbum(album) : null;
  }

  async delete(id: string): Promise<void> {
    await this.albumRepository.delete({ id });
  }

  async addComment(albumId: string, text: string, user: User) {
    const exists = await this.albumRepository.existsBy({ id: albumId });
    if (!exists) {
      throw new NotFoundException(`Album with id ${albumId} not found`);
    }
    const comment = await this.commentRepository.save(
      this.commentRepository.create({
        id: generateId(),
        username: user.displayName,
        text,
        albumId,
        userId: user.id,
      }),
    );
    comment.user = user;
    return serializeComment(comment);
  }
}
