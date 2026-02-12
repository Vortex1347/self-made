import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Body,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ProductImageService } from '../../../services/product-image/product-image.service';
import { UpdateProductImageDto } from '../../../dto/product-image/update-product-image.dto';

function ensureProductUploadDir(productId: string) {
  const uploadsDir = path.resolve(process.env.API_UPLOADS_DIR || 'uploads');
  const productDir = path.join(uploadsDir, 'products', productId);
  fs.mkdirSync(productDir, { recursive: true });
  return productDir;
}

@Controller('api/v1/products/:productId/images')
@UseGuards(JwtAuthGuard)
export class ProductImageController {
  constructor(private readonly service: ProductImageService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: (req: Request, _file: Express.Multer.File, cb: (err: Error | null, dest: string) => void) => {
          const productId = (req.params as { productId?: string }).productId ?? '';
          cb(null, ensureProductUploadDir(productId));
        },
        filename: (_req: Request, file: Express.Multer.File, cb: (err: Error | null, name: string) => void) => {
          const ext = path.extname(file.originalname || '').toLowerCase();
          cb(null, `${uuid()}${ext}`);
        },
      }),
      fileFilter: (_req: Request, file: Express.Multer.File, cb: (err: Error | null, accept: boolean) => void) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@Param('productId') productId: string, @UploadedFiles() files: Express.Multer.File[] | undefined) {
    if (!files || files.length === 0) throw new BadRequestException('No files uploaded');
    return this.service.addImages(productId, files);
  }

  @Patch(':id')
  updateSortOrder(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductImageDto,
  ) {
    return this.service.updateSortOrder(productId, id, dto.sortOrder);
  }

  @Delete(':id')
  remove(@Param('productId') productId: string, @Param('id') id: string) {
    return this.service.remove(productId, id);
  }
}
