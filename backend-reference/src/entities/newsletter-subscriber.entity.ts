import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum NewsletterStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  UNSUBSCRIBED = 'unsubscribed',
}

@Entity('newsletter_subscriber')
export class NewsletterSubscriberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: NewsletterStatus.PENDING })
  status: NewsletterStatus;

  @Column({ type: 'varchar', nullable: true })
  token: string | null;

  @Column({ name: 'token_expires_at', type: 'timestamp', nullable: true })
  tokenExpiresAt: Date | null;

  @Column({ name: 'unsubscribe_token', type: 'varchar', nullable: true, unique: true })
  unsubscribeToken: string | null;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
