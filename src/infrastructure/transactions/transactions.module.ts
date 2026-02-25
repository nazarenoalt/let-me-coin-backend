import { Module } from '@nestjs/common';
import { TransactionsService } from '@application/transactions/transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
