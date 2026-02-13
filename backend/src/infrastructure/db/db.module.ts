import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserEntity } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      synchronize: process.env.API_ENVIRONMENT === 'develop',
    }),
    // UserEntity is injected from DbModule. Other entities are registered
    // in feature modules via TypeOrmModule.forFeature([...]).
    // Full entity list is discovered by dataSourceOptions.entities glob.
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
