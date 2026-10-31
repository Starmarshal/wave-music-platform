import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlaylistsService } from './playlists.service';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { User } from '../users/entities/user.entity';
import { FileService, FileType, IMAGE_LIMITS } from '../file/file.service';
import { AuditService } from '../access/audit.service';
import { parseIdList } from '../shared/form';

const parseBool = (value: unknown) =>
  value === undefined ? undefined : value === true || value === 'true';

@Controller('/playlists')
export class PlaylistsController {
  constructor(
    private playlistsService: PlaylistsService,
    private fileService: FileService,
    private auditService: AuditService,
  ) {}

  @Get('/my')
  @Auth()
  my(@CurrentUser() user: User) {
    return this.playlistsService.listOwned(user);
  }

  @Get()
  listPublic(@Query('query') query?: string) {
    return this.playlistsService.listPublic(query);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.playlistsService.getOne(id, user);
  }

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('cover', { limits: IMAGE_LIMITS }))
  create(
    @UploadedFile() cover,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    return this.playlistsService.create(
      {
        name: body.name,
        description: body.description,
        isPublic: parseBool(body.isPublic),
        artistId: body.artistId || null,
        cover: cover ? this.fileService.createFile(FileType.IMAGE, cover) : '',
      },
      user,
    );
  }

  @Patch(':id')
  @Auth()
  @UseInterceptors(FileInterceptor('cover', { limits: IMAGE_LIMITS }))
  update(
    @Param('id') id: string,
    @UploadedFile() cover,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    return this.playlistsService.update(
      id,
      {
        name: body.name,
        description: body.description,
        isPublic: parseBool(body.isPublic),
        cover: cover
          ? this.fileService.createFile(FileType.IMAGE, cover)
          : undefined,
      },
      user,
    );
  }

  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    const playlist = await this.playlistsService.delete(id, user);
    // В журнал попадает только удаление чужого плейлиста (админом или лейблом)
    if (playlist.ownerId !== user.id) {
      await this.auditService.log(user, 'delete', 'playlist', id, {
        name: playlist.name,
      });
    }
    return { ok: true };
  }

  @Post(':id/tracks')
  @Auth()
  addTrack(
    @Param('id') id: string,
    @Body('trackId') trackId: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistsService.addTrack(id, trackId, user);
  }

  @Delete(':id/tracks/:trackId')
  @Auth()
  removeTrack(
    @Param('id') id: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ) {
    return this.playlistsService.removeTrack(id, trackId, user);
  }

  @Put(':id/order')
  @Auth()
  reorder(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: User,
  ) {
    return this.playlistsService.reorder(
      id,
      parseIdList(body, 'trackIds') ?? [],
      user,
    );
  }
}
