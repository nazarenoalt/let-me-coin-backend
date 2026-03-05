import { Account } from '@domain/accounts/account.entity';
import { CreateTransactionDto } from '@domain/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@domain/transactions/dto/update-transaction.dto';
import { ITransactionRepository } from '@domain/transactions/interfaces/transactionsRepository.interface';
import { Transaction } from '@domain/transactions/transaction.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';

export const TRANSACTIONS_REPOSITORY = 'TransactionsRepository';
@Injectable()
export class TransactionsRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  findByAccountId(ids: string[]): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { account: { id: In(ids) } },
    });
  }

  findByUserId(id: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { account: { user: { id } } },
    });
  }

  findone(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const { accountId, ...restDto } = dto;
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account)
      throw new NotFoundException(
        `The account where te transaction is being linked does not exist.`,
      );
    const transaction = this.transactionRepository.create({
      ...restDto,
      account,
    });
    return this.transactionRepository.save(transaction);
  }

  update(id: string, dto: UpdateTransactionDto): Promise<UpdateResult> {
    return this.transactionRepository.update(id, dto);
  }
  updateMany(ids: string[], dto: UpdateTransactionDto): Promise<UpdateResult> {
    return this.transactionRepository.update(ids, dto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.transactionRepository.delete(id);
  }
  removeMany(ids: string): Promise<DeleteResult> {
    return this.transactionRepository.delete(ids);
  }
}
