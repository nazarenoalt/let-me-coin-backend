import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from '@domain/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@domain/transactions/dto/update-transaction.dto';
import {
  TRANSACTIONS_REPOSITORY,
  type ITransactionRepository,
} from '@domain/transactions/interfaces/transactionsRepository.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
  ) {}

  create(dto: CreateTransactionDto) {
    return this.transactionsRepository.create(dto);
  }

  findByAccountId(accountId: string) {
    return this.transactionsRepository.findByAccountId(accountId);
  }

  findByUserId(userId: string) {
    return this.transactionsRepository.findByUserId(userId);
  }

  async findOne(id: string) {
    const transaction = await this.transactionsRepository.findOne(id);
    if (!transaction)
      throw new NotFoundException(`The transaction was not found`);

    return transaction;
  }

  update(id: string, dto: UpdateTransactionDto) {
    return this.transactionsRepository.update(id, dto);
  }

  remove(ids: string[]) {
    return this.transactionsRepository.remove(ids);
  }
}
