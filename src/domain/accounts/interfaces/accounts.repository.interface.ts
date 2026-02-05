import { DeleteResult } from 'typeorm';
import { Account } from '../account.entity';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { PaginationDto } from '@infrastructure/modules/common/dto/pagination.dto';

export interface IAccountsRepository {
  create(dto: CreateAccountDto): Promise<Account>;
  findAll(pagination: PaginationDto): Promise<Account[]>;
  findOne(id: string): Promise<Account | null>;
  update(id: string, dto: UpdateAccountDto): Promise<void>;
  updateMany(ids: string[], dto: UpdateAccountDto): Promise<void>;
  remove(id: string): Promise<DeleteResult>;
  removeMany(ids: string[]): Promise<void>;
}
