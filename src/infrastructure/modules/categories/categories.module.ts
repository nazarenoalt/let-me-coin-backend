import { Module } from '@nestjs/common';
import { CategoriesService } from 'src/application/categories/categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
