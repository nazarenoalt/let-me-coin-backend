import { Module } from '@nestjs/common';
import { AccountsService } from '@application/accounts/accounts.service';
import { AccountsController } from './accounts.controller';
import { ACCOUNTS_REPOSITORY } from '@domain/accounts/interfaces/accounts.repository.interface';
import { UsersRepository } from '../users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@domain/accounts/account.entity';
import { User } from '@domain/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  controllers: [AccountsController],
  providers: [
    { provide: ACCOUNTS_REPOSITORY, useClass: UsersRepository },
    AccountsService,
  ],
})
export class AccountsModule {}
