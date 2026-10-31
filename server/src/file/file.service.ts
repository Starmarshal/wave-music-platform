import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

export const IMAGE_LIMITS = { fileSize: 10 * 1024 * 1024 };
export const TRACK_LIMITS = { fileSize: 100 * 1024 * 1024 };

const ALLOWED_EXTENSIONS: Record<FileType, string[]> = {
  [FileType.IMAGE]: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
  [FileType.AUDIO]: ['mp3', 'm4a', 'aac', 'ogg', 'oga', 'opus', 'wav', 'flac'],
};

@Injectable()
export class FileService {
  createFile(type: FileType, file): string {
    const fileExtension = String(
      file.originalname.split('.').pop(),
    ).toLowerCase();
    const mimetype = String(file.mimetype);
    if (
      !ALLOWED_EXTENSIONS[type].includes(fileExtension) ||
      // Некоторые браузеры отдают аудио как octet-stream
      !(
        mimetype.startsWith(`${type}/`) ||
        mimetype === 'application/octet-stream'
      )
    ) {
      throw new BadRequestException(
        type === FileType.IMAGE
          ? 'Неподдерживаемый формат изображения'
          : 'Неподдерживаемый формат аудио',
      );
    }
    try {
      const fileName = uuid.v4() + '.' + fileExtension;
      // Используем абсолютный путь к папке static относительно корня проекта
      const staticPath = path.resolve(process.cwd(), 'static', type);
      if (!fs.existsSync(staticPath)) {
        fs.mkdirSync(staticPath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(staticPath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(filename: string) {}
}
