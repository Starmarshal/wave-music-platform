import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { AlbumTrack } from './entities/album-track.entity';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FileService, FileType } from '../file/file.service';
import { Comment } from '../track/entities/comment.entity';
import { Track } from '../track/entities/track.entity';
import { CreateAlbumCommentDTO } from './dto/create-album-comment.dto';
import { generateId } from '../shared/object-id';
import { serializeAlbum, serializeComment } from '../shared/serializers';

const ALBUM_RELATIONS = {
  albumTracks: { track: { comments: true } },
  comments: true,
};

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectDataSource() private dataSource: DataSource,
    private fileService: FileService,
  ) {}

  async create(dto: CreateAlbumDTO, picture) {
    if (!picture) {
      throw new BadRequestException('Picture is required');
    }
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const albumId = generateId();

    await this.dataSource.transaction(async (manager) => {
      await manager.insert(Album, {
        id: albumId,
        name: dto.name,
        author: dto.author,
        picture: picturePath,
      });

      // Несуществующие и повторяющиеся id треков пропускаем
      const requestedIds = [...new Set(dto.tracks)];
      const existing = requestedIds.length
        ? await manager.findBy(Track, { id: In(requestedIds) })
        : [];
      const existingIds = new Set(existing.map((track) => track.id));
      const albumTracks = requestedIds
        .filter((id) => existingIds.has(id))
        .map((trackId, position) => ({ albumId, trackId, position }));
      if (albumTracks.length) {
        await manager.insert(AlbumTrack, albumTracks);
      }
    });

    return this.getOne(albumId);
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

  async addComment(dto: CreateAlbumCommentDTO) {
    const exists = await this.albumRepository.existsBy({ id: dto.albumId });
    if (!exists) {
      throw new NotFoundException(`Album with id ${dto.albumId} not found`);
    }
    const comment = await this.commentRepository.save(
      this.commentRepository.create({
        id: generateId(),
        username: dto.username,
        text: dto.text,
        albumId: dto.albumId,
      }),
    );
    return serializeComment(comment);
  }
}
