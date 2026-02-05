import { Account } from '@domain/accounts/account.entity';
import { IAccountsRepository } from '@domain/accounts/interfaces/accounts.repository.interface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccountDto } from '@domain/accounts/dto/create-account.dto';
import { UpdateAccountDto } from '@domain/accounts/dto/update-account.dto';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class AccountsRepository implements IAccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  // TODO: user ID must be transferred on DTO to link the user to the account?
  async create(dto: CreateAccountDto): Promise<Account> {
    const user = this.repository.create(dto);
    try {
      return await this.repository.save(user);
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  async findAll({ limit = 0, offset = 0 }: PaginationDto): Promise<Account[]> {
    try {
      return await this.repository.find({
        skip: offset,
        take: limit,
      });
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Account | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, dto: UpdateAccountDto): Promise<UpdateResult> {
    try {
      return await this.repository.update(id, dto);
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }
}
