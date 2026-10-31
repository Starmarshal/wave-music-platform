import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlbumService } from './album.service';
import { CreateAlbumCommentDTO } from './dto/create-album-comment.dto';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { Role, User } from '../users/entities/user.entity';
import { AccessService } from '../access/access.service';
import { AuditService } from '../access/audit.service';
import { IMAGE_LIMITS } from '../file/file.service';
import { parseIdList } from '../shared/form';

@Controller('/albums')
export class AlbumController {
  constructor(
    private albumService: AlbumService,
    private accessService: AccessService,
    private auditService: AuditService,
  ) {}

  @Post()
  @Auth({ role: Role.LABEL })
  @UseInterceptors(FileInterceptor('picture', { limits: IMAGE_LIMITS }))
  async create(
    @UploadedFile() picture,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    const artistIds = parseIdList(body, 'artistIds') ?? [];
    if (!artistIds.length) throw new BadRequestException('Укажите артистов');
    const trackIds = parseIdList(body, 'tracks') ?? [];
    await this.accessService.assertCanManageArtists(user, artistIds);
    await this.accessService.assertCanUseTracks(user, trackIds);
    const album = await this.albumService.create(
      { name: body.name, artistIds, trackIds },
      picture,
      user,
    );
    await this.auditService.log(user, 'create', 'album', album!._id, {
      name: album!.name,
    });
    return album;
  }

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.albumService.getOne(id);
  }

  @Patch(':id')
  @Auth({ role: Role.LABEL })
  @UseInterceptors(FileInterceptor('picture', { limits: IMAGE_LIMITS }))
  async update(
    @Param('id') id: string,
    @UploadedFile() picture,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    await this.accessService.assertCanManageAlbum(user, id);
    const artistIds = parseIdList(body, 'artistIds');
    if (artistIds) {
      if (!artistIds.length) throw new BadRequestException('Укажите артистов');
      await this.accessService.assertCanManageArtists(user, artistIds);
    }
    const trackIds = parseIdList(body, 'tracks');
    if (trackIds) await this.accessService.assertCanUseTracks(user, trackIds);
    const album = await this.albumService.update(
      id,
      { name: body.name, artistIds, trackIds },
      picture,
    );
    await this.auditService.log(user, 'update', 'album', id, {
      name: album!.name,
    });
    return album;
  }

  @Delete(':id')
  @Auth({ role: Role.LABEL })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.accessService.assertCanManageAlbum(user, id);
    const album = await this.albumService.getOne(id);
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    await this.albumService.delete(id);
    await this.auditService.log(user, 'delete', 'album', id, {
      name: album.name,
    });
  }

  @Post('/comment')
  @Auth()
  addComment(@Body() dto: CreateAlbumCommentDTO, @CurrentUser() user: User) {
    return this.albumService.addComment(dto.albumId, dto.text, user);
  }
}
