import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CollectionEntity } from './collection.entity';
import { ProductImageEntity } from './product-image.entity';

export enum PriceType {
  FIXED = 'fixed',
  ON_REQUEST = 'on_request',
}

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'collection_id', nullable: true })
  collectionId: string | null;

  @Column({ type: 'varchar', name: 'price_type', default: PriceType.ON_REQUEST })
  priceType: PriceType;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number | null;

  @Column({ default: 'EUR' })
  currency: string;

  @Column({ type: 'text', name: 'description_short', nullable: true })
  descriptionShort: string | null;

  @Column({ type: 'jsonb', nullable: true })
  characteristics: Record<string, unknown> | null;

  @Column({ name: 'is_new', default: false })
  isNew: boolean;

  @Column({ name: 'is_limited', default: false })
  isLimited: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => CollectionEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionEntity | null;

  @OneToMany(() => ProductImageEntity, (img) => img.product)
  images: ProductImageEntity[];
}
