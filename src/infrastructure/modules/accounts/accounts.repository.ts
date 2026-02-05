import { Account } from '@domain/accounts/account.entity';
import { IAccountsRepository } from '@domain/accounts/interfaces/accounts.repository.interface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccountDto } from '@domain/accounts/dto/create-account.dto';

@Injectable()
export class AccountsRepository implements IAccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(dto: CreateAccountDto): Promise<Account> {
      const user = this.accountRepository.create(dto);
    try {
      await return this.accountRepository.insert(user)

    } catch(error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error)
    }
  }
  
  findAll({ limit = 0, offset = 0 }: PaginationDto): Promise<Account[]> {
    try {
      return this.accountRepository.find({
        skip: offset,
        take: limit,
      });
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: string): Promise<Account | null> {
    try {
      return this.accountRepository.findOne({ where: { id } });
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }
}
