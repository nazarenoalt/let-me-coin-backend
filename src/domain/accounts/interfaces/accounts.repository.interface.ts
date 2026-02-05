import { DeleteResult } from 'typeorm';
import { Account } from '../account.entity';

export interface IAccountsRepository {
  findAll(): Promise<Account[]>;
  findOne(): Promise<Account | null>;
  update(): Promise<void>;
  updateMany(): Promise<void>;
  remove(): Promise<DeleteResult>;
  removeMany(): Promise<void>;
}
