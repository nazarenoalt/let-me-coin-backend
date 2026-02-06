import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from '@domain/accounts/dto/create-account.dto';
import { UpdateAccountDto } from '@domain/accounts/dto/update-account.dto';
import {
  ACCOUNTS_REPOSITORY,
  type IAccountsRepository,
} from '@domain/accounts/interfaces/accounts.repository.interface';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(ACCOUNTS_REPOSITORY)
    private readonly accountsRepository: IAccountsRepository,
  ) {}

  create(userId: string, dto: CreateAccountDto) {
    return this.accountsRepository.create(userId, dto);
  }

  findByUserId(userId: string) {
    return this.accountsRepository.findByUserId(userId);
  }

  async findOne(id: string) {
    const account = await this.accountsRepository.findOne(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  update(id: string, dto: UpdateAccountDto) {
    return this.accountsRepository.update(id, dto);
  }

  async remove(id: string) {
    const account = await this.accountsRepository.findOne(id);

    if (!account) {
      throw new NotFoundException('The account to be deleted does not exist.');
    }
    return this.accountsRepository.remove(id);
  }
}
