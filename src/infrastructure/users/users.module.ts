import { Module } from '@nestjs/common';
import { UsersService } from 'src/application/users/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@domain/users/user.entity';
import { USERS_REPOSITORY } from '@domain/users/interfaces/user.repository.interface';
import { UsersRepository } from './users.repository';
import { Account } from '@domain/accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USERS_REPOSITORY, useClass: UsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
