import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ProductImageEntity } from '../../entities/product-image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private repo: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity) private imageRepo: Repository<ProductImageEntity>,
  ) {}

  async findAll(params: { page: number; limit: number; archivedOnly?: boolean }) {
    const limit = Math.min(Math.max(1, params.limit), 100);
    const page = Math.max(1, params.page);
    const [data, total] = await this.repo.findAndCount({
      where: params.archivedOnly ? { isArchived: true } : undefined,
      relations: ['category', 'collection'],
      order: { sortOrder: 'ASC', createdAt: 'DESC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (data.length > 0) {
      const productIds = data.map((p) => p.id);
      const images = await this.imageRepo.find({
        where: { productId: In(productIds) },
        order: { sortOrder: 'ASC' },
      });
      const imagesByProductId = images.reduce((acc, img) => {
        (acc[img.productId] ||= []).push(img);
        return acc;
      }, {} as Record<string, ProductImageEntity[]>);
      data.forEach((p) => {
        p.images = imagesByProductId[p.id] ?? [];
      });
    }
    return { data, meta: { total, page, limit } };
  }

  async create(dto: Record<string, unknown>) {
    const e = this.repo.create(dto as Partial<ProductEntity>);
    return this.repo.save(e);
  }

  async update(id: string, dto: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeORM update() jsonb typing is strict
    await this.repo.update(id, dto as any);
    return this.repo.findOne({
      where: { id },
      relations: ['category', 'collection', 'images'],
      order: { images: { sortOrder: 'ASC' } },
    });
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
