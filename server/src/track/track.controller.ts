import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TrackService } from './track.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { Role, User } from '../users/entities/user.entity';
import { AccessService } from '../access/access.service';
import { AuditService } from '../access/audit.service';
import { TRACK_LIMITS } from '../file/file.service';
import { parseIdList } from '../shared/form';

const TRACK_FILES = FileFieldsInterceptor(
  [
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ],
  { limits: TRACK_LIMITS },
);

@Controller('/tracks')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private accessService: AccessService,
    private auditService: AuditService,
  ) {}

  @Post()
  @Auth({ role: Role.LABEL })
  @UseInterceptors(TRACK_FILES)
  async create(
    @UploadedFiles() files,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    const picture = files?.picture?.[0];
    const audio = files?.audio?.[0];
    if (!picture || !audio) {
      throw new BadRequestException('Нужны обложка и аудиофайл');
    }
    const artistIds = parseIdList(body, 'artistIds') ?? [];
    if (!artistIds.length) throw new BadRequestException('Укажите артистов');
    await this.accessService.assertCanManageArtists(user, artistIds);
    const track = await this.trackService.create(
      { name: body.name, text: body.text, artistIds },
      picture,
      audio,
      user,
    );
    await this.auditService.log(user, 'create', 'track', track._id, {
      name: track.name,
    });
    return track;
  }

  @Get()
  getAll(@Query('count') count?: number, @Query('offset') offset?: number) {
    return this.trackService.getAll(count, offset);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.trackService.getOne(id);
  }

  @Patch(':id')
  @Auth({ role: Role.LABEL })
  @UseInterceptors(TRACK_FILES)
  async update(
    @Param('id') id: string,
    @UploadedFiles() files,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    await this.accessService.assertCanManageTrack(user, id);
    const artistIds = parseIdList(body, 'artistIds');
    if (artistIds) {
      if (!artistIds.length) throw new BadRequestException('Укажите артистов');
      await this.accessService.assertCanManageArtists(user, artistIds);
    }
    const track = await this.trackService.update(
      id,
      { name: body.name, text: body.text, artistIds },
      files?.picture?.[0],
    );
    await this.auditService.log(user, 'update', 'track', id, {
      name: track.name,
    });
    return track;
  }

  @Delete(':id')
  @Auth({ role: Role.LABEL })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.accessService.assertCanManageTrack(user, id);
    const track = await this.trackService.getOne(id);
    await this.trackService.delete(id);
    await this.auditService.log(user, 'delete', 'track', id, {
      name: track.name,
    });
    return id;
  }

  @Post('/comment')
  @Auth()
  addComment(@Body() dto: CreateCommentDTO, @CurrentUser() user: User) {
    return this.trackService.addComment(dto.trackId, dto.text, user);
  }

  @Post('/listen/:id')
  @Auth()
  listen(@Param('id') id: string, @CurrentUser() user: User) {
    return this.trackService.listen(id, user);
  }
}
