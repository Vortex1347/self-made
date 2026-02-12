import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import { ProductImageEntity } from '../../entities/product-image.entity';
import { ProductEntity } from '../../entities/product.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity) private imageRepo: Repository<ProductImageEntity>,
    @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
  ) {}

  private getUploadsDir() {
    return path.resolve(process.env.API_UPLOADS_DIR || 'uploads');
  }

  private getDiskPath(filePath: string) {
    const normalized = filePath.replace(/^\/?uploads\/?/, '');
    return path.join(this.getUploadsDir(), normalized);
  }

  async addImages(productId: string, files: Array<{ filename: string }>) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    const existing = await this.imageRepo.find({
      where: { productId },
      order: { sortOrder: 'DESC' },
      take: 1,
    });
    const baseSort = existing[0]?.sortOrder ?? 0;
    const entities = files.map((file, idx) =>
      this.imageRepo.create({
        productId,
        filePath: `/uploads/products/${productId}/${file.filename}`,
        sortOrder: baseSort + idx + 1,
      }),
    );
    return this.imageRepo.save(entities);
  }

  async updateSortOrder(productId: string, id: string, sortOrder: number) {
    const image = await this.imageRepo.findOne({ where: { id, productId } });
    if (!image) throw new NotFoundException('Image not found');
    image.sortOrder = sortOrder;
    return this.imageRepo.save(image);
  }

  async remove(productId: string, id: string) {
    const image = await this.imageRepo.findOne({ where: { id, productId } });
    if (!image) throw new NotFoundException('Image not found');
    await this.imageRepo.delete({ id, productId });
    const diskPath = this.getDiskPath(image.filePath);
    try {
      fs.unlinkSync(diskPath);
    } catch (e) {
      // ignore if file already missing
    }
    return { deleted: true };
  }
}
