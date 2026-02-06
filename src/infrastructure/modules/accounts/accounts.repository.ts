import { Account } from '@domain/accounts/account.entity';
import { IAccountsRepository } from '@domain/accounts/interfaces/accounts.repository.interface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from '@domain/accounts/dto/create-account.dto';
import { UpdateAccountDto } from '@domain/accounts/dto/update-account.dto';
import { UpdateResult } from 'typeorm/browser';
import { User } from '@domain/users/user.entity';

@Injectable()
export class AccountsRepository implements IAccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly userRepository: Repository<User>,
  ) {}

  // TODO: user ID must be transferred on DTO to link the user to the account?
  async create(userId: string, dto: CreateAccountDto): Promise<Account> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new NotFoundException(
        'The user Id is incorrect, the user does not exist.',
      );

    const account = this.accountRepository.create({
      ...dto,
      user,
    });
    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  async findAll({ limit = 0, offset = 0 }: PaginationDto): Promise<Account[]> {
    try {
      return await this.accountRepository.find({
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
      return await this.accountRepository.findOne({ where: { id } });
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, dto: UpdateAccountDto): Promise<UpdateResult> {
    try {
      return await this.accountRepository.update(id, dto);
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.accountRepository.delete(id);
    } catch (error) {
      // TODO: replace exception with global exception handler
      throw new InternalServerErrorException(error);
    }
  }
}
