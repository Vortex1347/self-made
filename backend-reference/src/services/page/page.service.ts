import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageEntity } from '../../entities/page.entity';

@Injectable()
export class PageService {
  constructor(@InjectRepository(PageEntity) private repo: Repository<PageEntity>) {}

  findAll() {
    return this.repo.find();
  }

  findOne(slug: string) {
    return this.repo.findOne({ where: { slug } });
  }

  async create(dto: { slug: string; title: string; content: string }) {
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) return existing;
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  async update(
    slug: string,
    dto: { title?: string; content?: string; contentBlocks?: Array<{ type: string; content: string }> }
  ) {
    await this.repo.update(slug, dto as Partial<PageEntity>);
    return this.repo.findOne({ where: { slug } });
  }
}
