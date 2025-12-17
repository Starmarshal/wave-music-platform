import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album, AlbumSchema } from './schema/album.schema';
import { FileModule } from '../file/file.module';
import { Comment, CommentSchema } from '../track/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema },
      { name: Comment.name, schema: CommentSchema }, // Добавляем Comment
    ]),
    FileModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
