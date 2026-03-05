import { Account } from '@domain/accounts/account.entity';
import { CreateTransactionDto } from '@domain/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@domain/transactions/dto/update-transaction.dto';
import { ITransactionRepository } from '@domain/transactions/interfaces/transactionsRepository.interface';
import { Transaction } from '@domain/transactions/transaction.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class TransactionsRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  findByAccountId(accountId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { account: { id: accountId } },
    });
  }

  findByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { account: { user: { id: userId } } },
    });
  }

  findOne(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const { accountId, ...restDto } = dto;
    const account = await this.accountsRepository.findOne({
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

  remove(ids: string[]): Promise<DeleteResult> {
    return this.transactionRepository.delete(ids);
  }
}
