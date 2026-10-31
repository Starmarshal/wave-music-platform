import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FileModule } from './file/file.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { AccessModule } from './access/access.module';
import { ArtistsModule } from './artists/artists.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { StudioModule } from './studio/studio.module';

@Module({
  imports: [
    // Публично раздаются только картинки; аудио — через AudioController после проверки входа
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static', 'image'),
      serveRoot: '/static/image',
    }),
    // useFactory, чтобы переменные окружения читались после загрузки .env в main.ts
    TypeOrmModule.forRootAsync({ useFactory: dataSourceOptions }),
    // Общий лимит от флуда; на входе и кодах 2FA свои, более строгие
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 300 }]),
    AccessModule,
    AuthModule,
    TrackModule,
    AlbumModule,
    FileModule,
    ArtistsModule,
    PlaylistsModule,
    LikesModule,
    CommentsModule,
    AdminModule,
    StudioModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
