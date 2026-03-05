import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '@domain/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@domain/transactions/dto/update-transaction.dto';
import { TRANSACTIONS_REPOSITORY } from '@infrastructure/transactions/transactions.repository';
import { type ITransactionRepository } from '@domain/transactions/interfaces/transactionsRepository.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
  ) {}

  create(dto: CreateTransactionDto) {
    return this.transactionsRepository.create(dto);
  }

  findByAccountId() {
    return this.transactionsRepository.findByAccountId();
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, dto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
