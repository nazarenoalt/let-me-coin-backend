import { Account } from '@domain/accounts/account.entity';
import { CreateTransactionDto } from '@domain/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@domain/transactions/dto/update-transaction.dto';
import { ITransactionRepository } from '@domain/transactions/interfaces/transactionsRepository.interface';
import { Transaction } from '@domain/transactions/transaction.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Money } from '@shared/domain/value-objects/Money';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TransactionsRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const { accountId, amount, currency, ...restDto } = dto;
    const account = await this.accountsRepository.findOne({
      where: { id: accountId },
    });

    if (!account)
      throw new NotFoundException(
        `The account where te transaction is being linked does not exist.`,
      );

    if (!account.isActive)
      throw new ConflictException(
        'The account where the transaction is being created is inactive',
      );

    const transaction = this.transactionRepository.create({
      ...restDto,
      account,
    });
    transaction.amount = new Money(amount, currency);

    return this.transactionRepository.save(transaction);
  }

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
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['account'],
    });
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneByOrFail({
      id,
    });

    const { amount, currency, ...restDto } = dto;
    Object.assign(transaction, restDto);

    if (amount && currency) {
      transaction.amount = new Money(amount, currency);
    }

    return this.transactionRepository.save(transaction);
  }

  remove(ids: string[]): Promise<DeleteResult> {
    return this.transactionRepository.delete(ids);
  }
}
