import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseTopicEntity } from './course-topic.entity';
import { StudentEntity } from './student.entity';

@Entity({ name: 'topic_comment' })
export class TopicCommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'topic_id', type: 'uuid' })
  topicId: string;

  @ManyToOne(() => CourseTopicEntity, (topic) => topic.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: CourseTopicEntity;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => StudentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;

  @Column({ name: 'author_name' })
  authorName: string;

  @Column({ name: 'author_login' })
  authorLogin: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ name: 'edited_by_admin', default: false })
  editedByAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
