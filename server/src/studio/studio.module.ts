import { Module } from '@nestjs/common';
import { StudioController } from './studio.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  controllers: [StudioController],
})
export class StudioModule {}
