import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CourseTopicEntity } from './course-topic.entity';

@Entity({ name: 'course_module' })
export class CourseModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'order_index', type: 'integer', default: 0 })
  orderIndex: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @OneToMany(() => CourseTopicEntity, (topic) => topic.module)
  topics: CourseTopicEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
