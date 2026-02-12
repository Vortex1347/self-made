import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: Transporter | null = null;
  private from: string | null = null;

  private ensureTransporter() {
    if (this.transporter) return;
    const host = process.env.API_SMTP_HOST;
    const port = parseInt(process.env.API_SMTP_PORT || '465', 10);
    const user = process.env.API_SMTP_USER_NAME;
    const pass = process.env.API_SMTP_PASSWORD;
    if (!host || !user || !pass) {
      throw new InternalServerErrorException('SMTP is not configured');
    }
    const secure = port === 465;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    this.from = process.env.API_SMTP_SENDER_EMAIL || user;
  }

  async sendMail(options: { to: string; subject: string; text: string; html?: string }) {
    this.ensureTransporter();
    try {
      await this.transporter!.sendMail({
        from: this.from!,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
    } catch (error) {
      throw new InternalServerErrorException('Email sending failed');
    }
  }
}
