import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingEntity } from '../../entities/setting.entity';

@Injectable()
export class SettingService {
  constructor(@InjectRepository(SettingEntity) private repo: Repository<SettingEntity>) {}

  async findAll() {
    const rows = await this.repo.find();
    return rows.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as Record<string, string>);
  }

  async update(dto: Record<string, string>) {
    for (const [key, value] of Object.entries(dto)) {
      await this.repo.upsert({ key, value }, ['key']);
    }
    return this.findAll();
  }
}
