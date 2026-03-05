import { Module } from '@nestjs/common';
import { TransactionsService } from '@application/transactions/transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@domain/transactions/transaction.entity';
import { TransactionsRepository } from './transactions.repository';
import { TRANSACTIONS_REPOSITORY } from '@domain/transactions/interfaces/transactionsRepository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: TransactionsRepository,
    },
  ],
})
export class TransactionsModule {}
