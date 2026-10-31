import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { Comment } from './entities/comment.entity';
import { FileService, FileType } from '../file/file.service';
import { ArtistsService } from '../artists/artists.service';
import { User } from '../users/entities/user.entity';
import { generateId } from '../shared/object-id';
import {
  serializeComment,
  serializeTrack,
  TRACK_RELATIONS,
} from '../shared/serializers';

// Повторное прослушивание того же трека тем же пользователем раньше этого срока не засчитывается
const LISTEN_DEDUP_SECONDS = 30;

export interface TrackInput {
  name?: string;
  text?: string;
  artistIds?: string[];
}

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectDataSource() private dataSource: DataSource,
    private fileService: FileService,
    private artistsService: ArtistsService,
  ) {}

  async create(input: TrackInput, picture, audio, user: User) {
    const artistIds = await this.artistsService.assertExist(
      input.artistIds ?? [],
    );
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const id = generateId();
    await this.dataSource.transaction(async (manager) => {
      await manager.insert(Track, {
        id,
        name: input.name ?? '',
        text: input.text ?? '',
        listens: 0,
        audio: audioPath,
        picture: picturePath,
        createdBy: user.id,
      });
      await this.artistsService.setTrackArtists(id, artistIds, manager);
    });
    return this.getOne(id);
  }

  async update(id: string, input: TrackInput, picture?) {
    await this.findOrFail(id);
    await this.dataSource.transaction(async (manager) => {
      const patch: Partial<Track> = {};
      if (input.name !== undefined) patch.name = input.name;
      if (input.text !== undefined) patch.text = input.text;
      if (picture)
        patch.picture = this.fileService.createFile(FileType.IMAGE, picture);
      if (Object.keys(patch).length) await manager.update(Track, { id }, patch);
      if (input.artistIds) {
        const artistIds = await this.artistsService.assertExist(
          input.artistIds,
        );
        await this.artistsService.setTrackArtists(id, artistIds, manager);
      }
    });
    return this.getOne(id);
  }

  private async findOrFail(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return track;
  }

  async getAll(count?: number, offset?: number) {
    const tracks = await this.trackRepository.find({
      relations: TRACK_RELATIONS,
      order: { createdAt: 'ASC', id: 'ASC' },
      skip: offset ? Number(offset) : undefined,
      take: count && count > 0 ? Number(count) : undefined,
    });
    return tracks.map((track) => serializeTrack(track));
  }

  async getOne(id: string) {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: TRACK_RELATIONS,
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

  async addComment(trackId: string, text: string, user: User) {
    await this.findOrFail(trackId);
    const comment = await this.commentRepository.save(
      this.commentRepository.create({
        id: generateId(),
        username: user.displayName,
        text,
        trackId,
        userId: user.id,
      }),
    );
    comment.user = user;
    return serializeComment(comment);
  }

  async listen(id: string, user: User) {
    await this.findOrFail(id);
    const recent = await this.dataSource.query(
      `SELECT 1 FROM listens WHERE user_id = $1 AND track_id = $2
       AND listened_at > now() - make_interval(secs => $3) LIMIT 1`,
      [user.id, id, LISTEN_DEDUP_SECONDS],
    );
    if (recent.length) return;
    await this.dataSource.transaction(async (manager) => {
      await manager.query(
        `INSERT INTO listens (track_id, user_id) VALUES ($1, $2)`,
        [id, user.id],
      );
      await manager.increment(Track, { id }, 'listens', 1);
    });
  }

  async search(query: string) {
    const escaped = (query ?? '').replace(/[\\%_]/g, '\\$&');
    const tracks = await this.trackRepository.find({
      where: [
        { name: ILike(`%${escaped}%`) },
        { artist: ILike(`%${escaped}%`) },
      ],
      relations: TRACK_RELATIONS,
      order: { createdAt: 'ASC', id: 'ASC' },
    });
    return tracks.map((track) => serializeTrack(track));
  }
}
