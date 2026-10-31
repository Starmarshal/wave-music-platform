import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { Session } from './entities/session.entity';
import { UserToken } from './entities/user-token.entity';
import { BackupCode } from './entities/backup-code.entity';
import { Label } from '../labels/entities/label.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session, UserToken, BackupCode, Label]),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionService, MailService],
  exports: [AuthService, SessionService],
})
export class AuthModule {}
