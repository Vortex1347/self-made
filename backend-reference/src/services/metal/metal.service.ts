import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetalEntity } from '../../entities/metal.entity';

@Injectable()
export class MetalService {
  constructor(@InjectRepository(MetalEntity) private repo: Repository<MetalEntity>) {}

  findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  async create(dto: { name: string; sortOrder?: number }) {
    const e = this.repo.create({
      name: dto.name.trim(),
      sortOrder: dto.sortOrder ?? 0,
    });
    return this.repo.save(e);
  }

  async update(id: string, dto: { name?: string; sortOrder?: number }) {
    await this.repo.update(id, {
      ...(dto.name != null && { name: dto.name.trim() }),
      ...(dto.sortOrder != null && { sortOrder: dto.sortOrder }),
    });
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
