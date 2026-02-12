import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from '../../entities/collection.entity';

@Injectable()
export class CollectionService {
  constructor(@InjectRepository(CollectionEntity) private repo: Repository<CollectionEntity>) {}

  findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  async findAllPaged(params: { page: number; limit: number }) {
    const limit = Math.min(Math.max(1, params.limit), 100);
    const page = Math.max(1, params.page);
    const [data, total] = await this.repo.findAndCount({
      order: { sortOrder: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit } };
  }

  async create(
    dto: { name: string; slug: string; description?: string; sortOrder?: number; isLimited?: boolean },
  ) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  async update(id: string, dto: Partial<CollectionEntity>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
