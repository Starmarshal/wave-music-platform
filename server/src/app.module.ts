import { Module } from '@nestjs/common';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static'),
      serveRoot: '/static',
      exclude: ['/api*'],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://mongodb:27017/music-platform',
    ),
    TrackModule,
    AlbumModule,
    FileModule,
  ],
})
export class AppModule {}
