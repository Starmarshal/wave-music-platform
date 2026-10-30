import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FileModule } from './file/file.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static'),
      serveRoot: '/static',
      exclude: ['/api*'],
    }),
    // useFactory, чтобы переменные окружения читались после загрузки .env в main.ts
    TypeOrmModule.forRootAsync({ useFactory: dataSourceOptions }),
    TrackModule,
    AlbumModule,
    FileModule,
  ],
})
export class AppModule {}
