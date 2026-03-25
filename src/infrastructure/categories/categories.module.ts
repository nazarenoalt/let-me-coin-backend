import { Module } from '@nestjs/common';
import { CategoriesService } from '@application/categories/categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@domain/categories/category.entity';
import { User } from '@domain/users/user.entity';
import { Account } from '@domain/accounts/account.entity';
import { CATEGORIES_REPOSITORY } from '@domain/categories/interfaces/categoriesRepository.interface';
import { CategoriesRepository } from './categories.repository';
import { USERS_REPOSITORY } from '@domain/users/interfaces/user.repository.interface';
import { UsersRepository } from '@infrastructure/users/users.repository';
import { ACCOUNTS_REPOSITORY } from '@domain/accounts/interfaces/accounts.repository.interface';
import { AccountsRepository } from '@infrastructure/accounts/accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User, Account])],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: CategoriesRepository,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: ACCOUNTS_REPOSITORY,
      useClass: AccountsRepository,
    },
  ],
})
export class CategoriesModule {}
