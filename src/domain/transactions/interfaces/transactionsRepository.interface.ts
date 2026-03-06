import { UpdateResult } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Transaction } from '../transaction.entity';
import { DeleteResult } from 'typeorm/browser';

export interface ITransactionRepository {
  create(dto: CreateTransactionDto): Promise<Transaction>;
  findByAccountId(ids: string): Promise<Transaction[]>;
  findByUserId(ids: string): Promise<Transaction[]>;
  findOne(id: string): Promise<Transaction | null>;
  update(id: string, dto: UpdateTransactionDto): Promise<Transaction>;
  remove(ids: string[]): Promise<DeleteResult>;
}

export const TRANSACTIONS_REPOSITORY = 'TransactionsRepository';
