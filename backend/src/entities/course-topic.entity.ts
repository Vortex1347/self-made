import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseModuleEntity } from './course-module.entity';
import { TopicCommentEntity } from './topic-comment.entity';

@Entity({ name: 'course_topic' })
export class CourseTopicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module_id', type: 'uuid' })
  moduleId: string;

  @ManyToOne(() => CourseModuleEntity, (module) => module.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: CourseModuleEntity;

  @Column()
  title: string;

  @Column({ name: 'order_index', type: 'integer', default: 0 })
  orderIndex: number;

  @Column({ name: 'content_blocks', type: 'jsonb', default: () => "'[]'::jsonb" })
  contentBlocks: unknown[];

  @Column({ type: 'jsonb', nullable: true })
  trainer: unknown | null;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @OneToMany(() => TopicCommentEntity, (comment) => comment.topic)
  comments: TopicCommentEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
