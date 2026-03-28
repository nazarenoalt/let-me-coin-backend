import { DeleteResult } from 'typeorm';
import { Category } from '../category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PaginationDto } from '@infrastructure/common/dto/pagination.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { UpdateResult } from 'typeorm/browser';

export interface ICategoriesRepository {
  create(dto: CreateCategoryDto): Promise<Category>;
  findByUserId(
    id: string,
    paginationDetails?: PaginationDto,
  ): Promise<Category[]>;
  findOne(id: string): Promise<Category | null>;
  update(id: string, dto: UpdateCategoryDto): Promise<UpdateResult>;
  remove(is: string): Promise<DeleteResult>;
}

export const CATEGORIES_REPOSITORY = 'CategoriesRepository';
