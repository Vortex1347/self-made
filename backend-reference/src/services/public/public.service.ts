import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategoryEntity } from '../../entities/category.entity';
import { CollectionEntity } from '../../entities/collection.entity';
import { ProductEntity } from '../../entities/product.entity';
import { ProductImageEntity } from '../../entities/product-image.entity';
import { PageEntity } from '../../entities/page.entity';
import { SettingEntity } from '../../entities/setting.entity';
import { MetalEntity } from '../../entities/metal.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(CollectionEntity) private collectionRepo: Repository<CollectionEntity>,
    @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity) private productImageRepo: Repository<ProductImageEntity>,
    @InjectRepository(PageEntity) private pageRepo: Repository<PageEntity>,
    @InjectRepository(SettingEntity) private settingRepo: Repository<SettingEntity>,
    @InjectRepository(MetalEntity) private metalRepo: Repository<MetalEntity>,
  ) {}

  async getCategories() {
    return this.categoryRepo.find({
      where: { isVisible: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getMetals() {
    return this.metalRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async getCollections() {
    return this.collectionRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async getProducts(params: {
    page: number;
    limit: number;
    categoryIds?: string[];
    collectionIds?: string[];
    material?: string;
    priceMin?: number;
    priceMax?: number;
    priceOnRequest?: boolean;
    sort?: string;
  }) {
    const limit = Math.min(Math.max(1, params.limit), 50);
    const page = Math.max(1, params.page);
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.collection', 'collection')
      .where('p.isActive = :active', { active: true })
      .andWhere('p.isArchived = :archived', { archived: false });

    if (params.categoryIds?.length)
      qb.andWhere('p.categoryId IN (:...categoryIds)', { categoryIds: params.categoryIds });
    if (params.collectionIds?.length)
      qb.andWhere('p.collectionId IN (:...collectionIds)', { collectionIds: params.collectionIds });
    if (params.material)
      qb.andWhere("(p.characteristics->>'material' ILIKE :material OR p.characteristics->>'Material' ILIKE :material)", {
        material: `%${params.material}%`,
      });
    if (params.priceMin != null) qb.andWhere('p.price >= :priceMin', { priceMin: params.priceMin });
    if (params.priceMax != null) qb.andWhere('p.price <= :priceMax', { priceMax: params.priceMax });
    if (params.priceOnRequest)
      qb.andWhere("(p.price_type = 'on_request' OR p.price IS NULL)");

    if (params.sort === 'price_asc' || params.sort === 'price_desc') {
      qb.andWhere('p.price IS NOT NULL').andWhere("(p.price_type IS NULL OR p.price_type != 'on_request')");
    }
    if (params.sort === 'price_asc')
      qb.orderBy('p.price', 'ASC').addOrderBy('p.id', 'ASC');
    else if (params.sort === 'price_desc')
      qb.orderBy('p.price', 'DESC').addOrderBy('p.id', 'ASC');
    else if (params.sort === 'new' || params.sort === 'is_new')
      qb.orderBy('p.isNew', 'DESC').addOrderBy('p.createdAt', 'DESC').addOrderBy('p.id', 'ASC');
    else qb.orderBy('p.createdAt', 'DESC').addOrderBy('p.id', 'ASC');

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    if (data.length > 0) {
      const productIds = data.map((p) => p.id);
      const images = await this.productImageRepo.find({
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

  async getProductBySlug(slug: string) {
    const product = await this.productRepo.findOne({
      where: { slug, isActive: true, isArchived: false },
      relations: ['category', 'collection', 'images'],
      order: { images: { sortOrder: 'ASC' } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getPage(slug: string) {
    const page = await this.pageRepo.findOne({ where: { slug } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async getSettings() {
    const rows = await this.settingRepo.find();
    return rows.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as Record<string, string>);
  }
}
