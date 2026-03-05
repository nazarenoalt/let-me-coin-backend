import { UpdateResult } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Transaction } from '../transaction.entity';
import { DeleteResult } from 'typeorm/browser';

export interface ITransactionRepository {
  findByAccountId(ids: string[]): Promise<Transaction[]>;
  findByUserId(ids: string): Promise<Transaction[]>;
  findone(id: string): Promise<Transaction | null>;
  create(dto: CreateTransactionDto): Promise<Transaction>;
  update(ids: string[], dto: UpdateTransactionDto): Promise<UpdateResult>;
  remove(ids: string[]): Promise<DeleteResult>;
}
