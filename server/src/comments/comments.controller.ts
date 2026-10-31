import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../track/entities/comment.entity';
import { Auth, CurrentUser } from '../auth/auth.decorators';
import { Role, User } from '../users/entities/user.entity';
import { AuditService } from '../access/audit.service';
import { serializeComment } from '../shared/serializers';

@Controller('/comments')
export class CommentsController {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private auditService: AuditService,
  ) {}

  // Лента последних комментариев для модерации в админке
  @Get()
  @Auth({ role: Role.ADMIN })
  async latest(@Query('offset') offset?: string) {
    const comments = await this.commentRepository.find({
      relations: { user: true, track: true, album: true },
      order: { createdAt: 'DESC' },
      take: 50,
      skip: Number(offset) || 0,
    });
    return comments.map((comment) => ({
      ...serializeComment(comment),
      track: comment.track
        ? { _id: comment.track.id, name: comment.track.name }
        : null,
      album: comment.album
        ? { _id: comment.album.id, name: comment.album.name }
        : null,
    }));
  }

  // Удалить может автор или админ
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException('Комментарий не найден');
    const isAuthor = comment.userId === user.id;
    if (!isAuthor && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Нет прав на удаление комментария');
    }
    await this.commentRepository.delete({ id });
    if (!isAuthor) {
      await this.auditService.log(user, 'delete', 'comment', id, {
        text: comment.text.slice(0, 200),
        author: comment.username,
      });
    }
    return { ok: true };
  }
}
