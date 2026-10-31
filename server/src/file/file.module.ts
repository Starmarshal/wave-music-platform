import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { AudioController } from './audio.controller';

@Module({
  controllers: [AudioController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
