import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { Auth } from '../auth/auth.decorators';

const AUDIO_DIR = path.resolve(process.cwd(), 'static', 'audio');

// Аудио отдаётся только вошедшим пользователям; картинки остаются публичными
@Controller('/static/audio')
export class AudioController {
  @Get(':file')
  @Auth()
  get(@Param('file') file: string, @Res() res: Response) {
    // Только имена вида <uuid>.<ext>, без путей
    if (!/^[\w-]+\.[a-z0-9]+$/i.test(file)) throw new NotFoundException();
    const filePath = path.join(AUDIO_DIR, file);
    if (!fs.existsSync(filePath)) throw new NotFoundException();
    // sendFile сам поддерживает Range-запросы, нужные для перемотки
    res.sendFile(filePath, {
      headers: { 'Cache-Control': 'private, max-age=86400' },
    });
  }
}
