import { IsString, Length } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @Length(1, 1000, { message: 'Комментарий: от 1 до 1000 символов' })
  readonly text: string;

  @IsString()
  @Length(24, 24)
  readonly trackId: string;
}
