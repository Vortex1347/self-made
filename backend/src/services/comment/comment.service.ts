import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicCommentEntity } from '../../entities/topic-comment.entity';
import { CourseTopicEntity } from '../../entities/course-topic.entity';
import { StudentEntity } from '../../entities/student.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(TopicCommentEntity)
    private commentRepo: Repository<TopicCommentEntity>,
    @InjectRepository(CourseTopicEntity)
    private topicRepo: Repository<CourseTopicEntity>,
  ) {}

  async listByTopic(topicId: string) {
    await this.ensureTopicExists(topicId);
    const comments = await this.commentRepo.find({
      where: { topicId },
      order: { createdAt: 'ASC' },
    });
    return comments.map((comment) => this.toPublicComment(comment));
  }

  async create(topicId: string, student: StudentEntity, text: string) {
    await this.ensureTopicExists(topicId);
    const entity = this.commentRepo.create({
      topicId,
      studentId: student.id,
      authorName: student.name,
      authorLogin: student.login,
      text: text.trim(),
      editedByAdmin: false,
    });
    const saved = await this.commentRepo.save(entity);
    return this.toPublicComment(saved);
  }

  async updateOwn(commentId: string, studentId: string, text: string) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.studentId !== studentId) throw new ForbiddenException('Forbidden');
    comment.text = text.trim();
    const saved = await this.commentRepo.save(comment);
    return this.toPublicComment(saved);
  }

  async deleteOwn(commentId: string, studentId: string) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.studentId !== studentId) throw new ForbiddenException('Forbidden');
    await this.commentRepo.delete({ id: commentId });
    return { ok: true };
  }

  async listAdmin() {
    const comments = await this.commentRepo.find({
      relations: { topic: true },
      order: { createdAt: 'DESC' },
      take: 300,
    });
    return comments.map((comment) => ({
      ...this.toPublicComment(comment),
      topicTitle: comment.topic?.title || '',
    }));
  }

  async updateAdmin(commentId: string, text: string) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    comment.text = text.trim();
    comment.editedByAdmin = true;
    const saved = await this.commentRepo.save(comment);
    return this.toPublicComment(saved);
  }

  async deleteAdmin(commentId: string) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.commentRepo.delete({ id: commentId });
    return { ok: true };
  }

  private async ensureTopicExists(topicId: string) {
    const topic = await this.topicRepo.findOne({ where: { id: topicId, isPublished: true } });
    if (!topic) throw new NotFoundException('Topic not found');
  }

  private toPublicComment(comment: TopicCommentEntity) {
    return {
      id: comment.id,
      topicId: comment.topicId,
      studentId: comment.studentId,
      authorName: comment.authorName,
      authorLogin: comment.authorLogin,
      text: comment.text,
      editedByAdmin: comment.editedByAdmin,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
