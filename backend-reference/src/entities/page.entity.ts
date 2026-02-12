import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

/**
 * Контент страницы: markdown или plain text. HTML не гарантируется;
 * если вставляется HTML — фронт обязан санитизировать (например DOMPurify).
 * При рендере: markdown → HTML через безопасный рендерер или санитайз перед вставкой.
 */
@Entity('page')
export class PageEntity {
  @PrimaryColumn()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'content_blocks', type: 'jsonb', nullable: true })
  contentBlocks: Array<{ type: string; content: string }> | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
