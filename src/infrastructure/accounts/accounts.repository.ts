import { Account } from '@domain/accounts/account.entity';
import { IAccountsRepository } from '@domain/accounts/interfaces/accounts.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from '@domain/accounts/dto/create-account.dto';
import { UpdateAccountDto } from '@domain/accounts/dto/update-account.dto';
import { UpdateResult } from 'typeorm/browser';
import { User } from '@domain/users/user.entity';

@Injectable()
export class AccountsRepository implements IAccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateAccountDto): Promise<Account> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user)
      throw new NotFoundException(
        'The user Id is incorrect, the user does not exist.',
      );

    const account = this.accountRepository.create({
      ...dto,
      user,
    });
    return await this.accountRepository.save(account);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: string): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateAccountDto): Promise<UpdateResult> {
    return await this.accountRepository.update(id, dto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.accountRepository.delete(id);
  }
}
