import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { NewsletterSubscriberEntity, NewsletterStatus } from '../../entities/newsletter-subscriber.entity';
import { MailerService } from '../../infrastructure/mailer/mailer.service';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriberEntity) private repo: Repository<NewsletterSubscriberEntity>,
    private mailer: MailerService,
  ) {}

  private getBaseUrl() {
    const base = process.env.API_PUBLIC_BASE_URL || 'http://localhost:3000';
    return base.replace(/\/+$/, '');
  }

  async subscribe(email: string, consent: boolean) {
    if (!consent) throw new BadRequestException('Consent required');
    let sub = await this.repo.findOne({ where: { email } });
    const token = uuid();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    if (sub) {
      sub.token = token;
      sub.tokenExpiresAt = tokenExpiresAt;
      sub.status = NewsletterStatus.PENDING;
      await this.repo.save(sub);
    } else {
      sub = this.repo.create({ email, token, tokenExpiresAt, status: NewsletterStatus.PENDING });
      await this.repo.save(sub);
    }
    const confirmUrl = `${this.getBaseUrl()}/api/public/newsletter/confirm?token=${token}`;
    await this.mailer.sendMail({
      to: email,
      subject: 'Elite Schmuck: подтверждение подписки',
      text:
        'Подтвердите подписку на рассылку Elite Schmuck.\n' +
        `Ссылка для подтверждения: ${confirmUrl}\n` +
        'Если вы не запрашивали подписку, просто проигнорируйте это письмо.',
    });
    return { message: 'Check your email to confirm subscription' };
  }

  async confirm(token: string) {
    const sub = await this.repo.findOne({ where: { token } });
    if (!sub || !sub.tokenExpiresAt || sub.tokenExpiresAt < new Date())
      throw new BadRequestException('Invalid or expired token');
    sub.status = NewsletterStatus.CONFIRMED;
    sub.confirmedAt = new Date();
    sub.token = null;
    sub.tokenExpiresAt = null;
    sub.unsubscribeToken = sub.unsubscribeToken || uuid();
    await this.repo.save(sub);
    const unsubscribeUrl = `${this.getBaseUrl()}/api/public/newsletter/unsubscribe?token=${sub.unsubscribeToken}`;
    await this.mailer.sendMail({
      to: sub.email,
      subject: 'Elite Schmuck: подписка подтверждена',
      text:
        'Спасибо за подтверждение подписки на рассылку Elite Schmuck.\n' +
        `Если вы захотите отписаться, используйте ссылку: ${unsubscribeUrl}`,
    });
    return { success: true, message: 'Subscription confirmed' };
  }

  async unsubscribe(token: string) {
    const sub = await this.repo.findOne({ where: { unsubscribeToken: token } });
    if (!sub) throw new NotFoundException('Invalid unsubscribe token');
    if (sub.status === NewsletterStatus.UNSUBSCRIBED) {
      return { success: true, message: 'Already unsubscribed' };
    }
    sub.status = NewsletterStatus.UNSUBSCRIBED;
    await this.repo.save(sub);
    return { success: true, message: 'Unsubscribed' };
  }
}
