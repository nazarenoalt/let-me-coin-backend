import { PaginationDto } from '@infrastructure/modules/common/dto/pagination.dto';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { BulkRemoveUsersDto } from '../dto/bulk-remove-users.dto';
import { User } from '../user.entity';
import { DeleteResult } from 'typeorm';

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(pagination: Partial<PaginationDto>): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<void>;
  updateMany(ids: string[], updateUserDto): Promise<void>;
  remove(id: string): Promise<DeleteResult>;
  removeMany(ids: BulkRemoveUsersDto): Promise<void>;
}

export const USERS_REPOSITORY = 'UsersRepository';
