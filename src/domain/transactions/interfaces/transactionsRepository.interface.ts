import { Transaction } from '../transaction.entity';

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>;
}
