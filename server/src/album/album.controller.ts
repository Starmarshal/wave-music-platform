import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumCommentDTO } from './dto/create-album-comment.dto';

@Controller('/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  create(@UploadedFile() picture, @Body() dto: any) {
    // Преобразуем tracks[] массив в tracks массив
    let tracks: string[] = [];
    if (dto.tracks) {
      tracks = Array.isArray(dto.tracks) ? dto.tracks : [dto.tracks];
    } else if (dto['tracks[]']) {
      tracks = Array.isArray(dto['tracks[]'])
        ? dto['tracks[]']
        : [dto['tracks[]']];
    }

    const createDto: CreateAlbumDTO = {
      name: dto.name,
      author: dto.author,
      tracks: tracks,
    };

    return this.albumService.create(createDto, picture);
  }

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.albumService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.albumService.delete(id);
  }

  // Новый эндпоинт для добавления комментария к альбому
  @Post('/comment')
  addComment(@Body() dto: CreateAlbumCommentDTO) {
    return this.albumService.addComment(dto);
  }
}
