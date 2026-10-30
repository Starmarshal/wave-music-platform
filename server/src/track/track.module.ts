import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Track } from './entities/track.entity';
import { Comment } from './entities/comment.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Comment]), FileModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
