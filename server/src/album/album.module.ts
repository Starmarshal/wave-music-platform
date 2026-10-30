import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { AlbumTrack } from './entities/album-track.entity';
import { FileModule } from '../file/file.module';
import { Comment } from '../track/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, AlbumTrack, Comment]), FileModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
