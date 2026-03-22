import { DeleteResult } from 'typeorm';
import { Category } from '../category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PaginationDto } from '@infrastructure/common/dto/pagination.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export interface ICategoryRepository {
  create(dto: CreateCategoryDto): Promise<Category>;
  findByUser(
    id: string,
    paginationDetails?: PaginationDto,
  ): Promise<Category[]>;
  findOne(id: string): Promise<Category>;
  update(ids: string[], dto: UpdateCategoryDto): Promise<Category>;
  remove(ids: string): Promise<DeleteResult>;
}
