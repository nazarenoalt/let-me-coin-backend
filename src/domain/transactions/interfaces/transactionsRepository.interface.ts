import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Transaction } from '../transaction.entity';
import { DeleteResult } from 'typeorm/browser';
import { PaginationDto } from '@infrastructure/common/dto/pagination.dto';

export interface ITransactionRepository {
  create(dto: CreateTransactionDto): Promise<Transaction>;
  findByAccountId(
    ids: string,
    paginationDetails?: Partial<PaginationDto>,
  ): Promise<Transaction[]>;
  findByUserId(
    ids: string,
    paginationDetails?: Partial<PaginationDto>,
  ): Promise<Transaction[]>;
  findOne(id: string): Promise<Transaction | null>;
  update(id: string, dto: UpdateTransactionDto): Promise<Transaction>;
  remove(ids: string[]): Promise<DeleteResult>;
}

export const TRANSACTIONS_REPOSITORY = 'TransactionsRepository';
