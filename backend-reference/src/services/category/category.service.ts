import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryFailedError } from 'typeorm';
import { CategoryEntity } from '../../entities/category.entity';
import type { CreateCategoryDto } from '../../dto/category/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private repo: Repository<CategoryEntity>) {}

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

  async create(dto: CreateCategoryDto) {
    const e = this.repo.create({
      name: dto.name.trim(),
      slug: dto.slug.trim(),
      sortOrder: dto.sortOrder ?? 0,
      isVisible: dto.isVisible ?? true,
      showInHeader: dto.showInHeader ?? false,
    });
    try {
      return await this.repo.save(e);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError?.code === '23505') {
        throw new ConflictException(`Category with slug "${dto.slug}" already exists`);
      }
      throw err;
    }
  }

  async update(id: string, dto: Partial<{ name: string; slug: string; sortOrder: number; isVisible: boolean; showInHeader: boolean }>) {
    await this.repo.update(id, dto as Partial<CategoryEntity>);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
