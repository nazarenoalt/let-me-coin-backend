import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '@domain/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@domain/categories/dto/update-category.dto';
import {
  CATEGORIES_REPOSITORY,
  type ICategoriesRepository,
} from '@domain/categories/interfaces/categoriesRepository.interface';
import { PaginationDto } from '@infrastructure/common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private categoriesRepository: ICategoriesRepository,
  ) {}

  create(dto: CreateCategoryDto) {
    return this.categoriesRepository.create(dto);
  }

  findByUserId(id: string, paginationDetails?: PaginationDto) {
    return this.categoriesRepository.findByUserId(id, paginationDetails);
  }

  findOne(id: string) {
    return this.categoriesRepository.findOne(id);
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.categoriesRepository.update(id, dto);
  }

  remove(id: string) {
    return this.categoriesRepository.remove(id);
  }
}
