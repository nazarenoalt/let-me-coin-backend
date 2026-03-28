import { Category } from '@domain/categories/category.entity';
import { CreateCategoryDto } from '@domain/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@domain/categories/dto/update-category.dto';
import { ICategoriesRepository } from '@domain/categories/interfaces/categoriesRepository.interface';
import { User } from '@domain/users/user.entity';
import { PaginationDto } from '@infrastructure/common/dto/pagination.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user)
      throw new NotFoundException(
        'The user Id is incorrect, the user does not exist.',
      );
    const category = this.categoryRepository.create({
      ...dto,
      user,
    });

    return this.categoryRepository.save(category);
  }

  findByUserId(
    id: string,
    paginationDetails?: PaginationDto,
  ): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { user: { id } },
      skip: paginationDetails?.offset,
      take: paginationDetails?.limit,
    });
  }

  findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  update(id: string, dto: UpdateCategoryDto): Promise<UpdateResult> {
    return this.categoryRepository.update(id, dto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.categoryRepository.delete(id);
  }
}
