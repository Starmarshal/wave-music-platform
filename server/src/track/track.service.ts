import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { Comment } from './entities/comment.entity';
import { CreateTrackDTO } from './dto/create-track.dto';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { FileService, FileType } from '../file/file.service';
import { generateId } from '../shared/object-id';
import { serializeComment, serializeTrack } from '../shared/serializers';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDTO, picture, audio) {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = await this.trackRepository.save(
      this.trackRepository.create({
        id: generateId(),
        name: dto.name,
        artist: dto.artist,
        text: dto.text,
        listens: 0,
        audio: audioPath,
        picture: picturePath,
      }),
    );
    return serializeTrack(track);
  }

  async getAll(count?: number, offset?: number) {
    const tracks = await this.trackRepository.find({
      relations: { comments: true },
      order: { createdAt: 'ASC', id: 'ASC' },
      skip: offset ? Number(offset) : undefined,
      take: count && count > 0 ? Number(count) : undefined,
    });
    return tracks.map((track) => serializeTrack(track));
  }

  async getOne(id: string) {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: { comments: true },
    });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return serializeTrack(track, true);
  }

  async delete(id: string): Promise<string> {
    const result = await this.trackRepository.delete({ id });
    if (!result.affected) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return id;
  }

  async addComment(dto: CreateCommentDTO) {
    const exists = await this.trackRepository.existsBy({ id: dto.trackId });
    if (!exists) {
      throw new NotFoundException(`Track with id ${dto.trackId} not found`);
    }
    const comment = await this.commentRepository.save(
      this.commentRepository.create({
        id: generateId(),
        username: dto.username,
        text: dto.text,
        trackId: dto.trackId,
      }),
    );
    return serializeComment(comment);
  }

  async listen(id: string) {
    const result = await this.trackRepository.increment({ id }, 'listens', 1);
    if (!result.affected) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async search(query: string) {
    const escaped = (query ?? '').replace(/[\\%_]/g, '\\$&');
    const tracks = await this.trackRepository.find({
      where: { name: ILike(`%${escaped}%`) },
      relations: { comments: true },
      order: { createdAt: 'ASC', id: 'ASC' },
    });
    return tracks.map((track) => serializeTrack(track));
  }
}
