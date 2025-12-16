import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from './schema/album.schema';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FileService, FileType } from '../file/file.service';
import { Comment, CommentDocument } from '../track/schemas/comment.schema';
import { CreateAlbumCommentDTO } from './dto/create-album-comment.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateAlbumDTO, picture): Promise<Album> {
    if (!picture) {
      throw new Error('Picture is required');
    }
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const tracksIds = dto.tracks.map((id) => new Types.ObjectId(id));
    const album = await this.albumModel.create({
      name: dto.name,
      author: dto.author,
      picture: picturePath,
      tracks: tracksIds,
      comments: [], // Добавляем пустой массив комментариев
    });
    return album.populate('tracks');
  }

  async getAll(): Promise<Album[]> {
    return this.albumModel
      .find()
      .populate('tracks')
      .populate('comments')
      .exec();
  }

  async getOne(id: string): Promise<Album | null> {
    return this.albumModel
      .findById(id)
      .populate('tracks')
      .populate('comments')
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.albumModel.findByIdAndDelete(id);
  }

  // Новый метод для добавления комментария к альбому
  async addComment(dto: CreateAlbumCommentDTO): Promise<Comment> {
    const album = await this.albumModel.findById(dto.albumId);
    if (!album) {
      throw new NotFoundException(`Album with id ${dto.albumId} not found`);
    }
    const comment = await this.commentModel.create({
      username: dto.username,
      text: dto.text,
    });
    album.comments.push(comment._id);
    await album.save();
    return comment;
  }
}
