import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Track } from './entities/track.entity';
import { Comment } from './entities/comment.entity';
import { FileModule } from '../file/file.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Comment]),
    FileModule,
    ArtistsModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
