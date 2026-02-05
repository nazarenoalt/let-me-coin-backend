import { CreateUserDto, UpdateUserDto } from '@domain/users/dto';
import { BulkRemoveUsersDto } from '@domain/users/dto/bulk-remove-users.dto';
import { User } from '@domain/users/user.entity';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from '@domain/users/interfaces/user.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '@infrastructure/modules/common/dto/pagination.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private usersRepository: IUsersRepository,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto);
  }

  findAll(pagination: Partial<PaginationDto>): Promise<User[]> {
    return this.usersRepository.findAll(pagination);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async updateMany(ids: string[], data: UpdateUserDto): Promise<void> {
    return this.usersRepository.updateMany(ids, data);
  }

  async remove(id: string): Promise<DeleteResult> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(id);
  }

  removeMany(dto: BulkRemoveUsersDto): Promise<void> {
    return this.usersRepository.removeMany(dto);
  }
}
