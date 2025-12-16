import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackDocument } from './schemas/track.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateTrackDTO } from './dto/create-track.dto';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDTO, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
    return track;
  }

  async getAll(count?: number, offset?: number): Promise<Track[]> {
    const query = this.trackModel.find();

    if (offset) {
      query.skip(Number(offset));
    }

    if (count && count > 0) {
      query.limit(Number(count));
    }

    const tracks = await query.exec();
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate('comments');
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    return track;
  }

  async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    return track._id;
  }

  async addComment(dto: CreateCommentDTO): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    if (!track) {
      throw new NotFoundException(`Track with id ${dto.trackId} not found`);
    }
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    track.listens += 1;
    await track.save();
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }
}
