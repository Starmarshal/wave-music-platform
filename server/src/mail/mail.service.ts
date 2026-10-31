import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

// Без SMTP_HOST письма выводятся в лог — удобно для локальной разработки
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter() {
    if (!process.env.SMTP_HOST) return null;
    if (!this.transporter) {
      const port = Number(process.env.SMTP_PORT) || 465;
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
    return this.transporter;
  }

  appUrl(path: string) {
    const base = (process.env.APP_URL || 'http://localhost:3000').replace(
      /\/$/,
      '',
    );
    return `${base}${path}`;
  }

  async send(to: string, subject: string, text: string) {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.log(`[mail to ${to}] ${subject}\n${text}`);
      return;
    }
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  }

  sendEmailVerification(to: string, token: string) {
    const link = this.appUrl(`/verify-email?token=${token}`);
    return this.send(
      to,
      'Подтверждение почты — Wave music',
      `Чтобы подтвердить почту, перейдите по ссылке:\n${link}\n\nСсылка действует 24 часа. Если вы не регистрировались, просто проигнорируйте письмо.`,
    );
  }

  sendPasswordReset(to: string, token: string) {
    const link = this.appUrl(`/reset-password?token=${token}`);
    return this.send(
      to,
      'Сброс пароля — Wave music',
      `Чтобы задать новый пароль, перейдите по ссылке:\n${link}\n\nСсылка действует 1 час. Если вы не запрашивали сброс, проигнорируйте письмо — пароль останется прежним.`,
    );
  }
}
