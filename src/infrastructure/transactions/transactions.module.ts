import { Module } from '@nestjs/common';
import { TransactionsService } from '@application/transactions/transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@domain/transactions/transaction.entity';
import { TransactionsRepository } from './transactions.repository';
import { TRANSACTIONS_REPOSITORY } from '@domain/transactions/interfaces/transactionsRepository.interface';
import { ACCOUNTS_REPOSITORY } from '@domain/accounts/interfaces/accounts.repository.interface';
import { AccountsRepository } from '@infrastructure/accounts/accounts.repository';
import { Account } from '@domain/accounts/account.entity';
import { User } from '@domain/users/user.entity';
import { USERS_REPOSITORY } from '@domain/users/interfaces/user.repository.interface';
import { UsersRepository } from '@infrastructure/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, User])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: TransactionsRepository,
    },
    {
      provide: ACCOUNTS_REPOSITORY,
      useClass: AccountsRepository,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
})
export class TransactionsModule {}
