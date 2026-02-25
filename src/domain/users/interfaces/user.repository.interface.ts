import { PaginationDto } from '@infrastructure/common/dto/pagination.dto';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { BulkRemoveUsersDto } from '../dto/bulk-remove-users.dto';
import { User } from '../user.entity';
import { DeleteResult } from 'typeorm';
import { UpdateResult } from 'typeorm/browser';

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(pagination: Partial<PaginationDto>): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult>;
  updateMany(ids: string[], updateUserDto): Promise<UpdateResult>;
  remove(id: string): Promise<DeleteResult>;
  removeMany(ids: BulkRemoveUsersDto): Promise<DeleteResult>;
}

export const USERS_REPOSITORY = 'UsersRepository';
