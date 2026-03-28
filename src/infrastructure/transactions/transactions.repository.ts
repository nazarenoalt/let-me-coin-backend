import { Account } from '@domain/accounts/account.entity';
import { Category } from '@domain/categories/category.entity';
import { CreateTransactionDto } from '@domain/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@domain/transactions/dto/update-transaction.dto';
import { ITransactionRepository } from '@domain/transactions/interfaces/transactionsRepository.interface';
import { Transaction } from '@domain/transactions/transaction.entity';
import { PaginationDto } from '@infrastructure/common/dto/pagination.dto';
import {
  BadRequestException,
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
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const { accountId, userId, categoryId, amount, currency, ...restDto } = dto;
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['user'],
    });

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!account)
      throw new NotFoundException(
        `The account where te transaction is being linked does not exist.`,
      );

    if (!category)
      throw new NotFoundException(
        `The category where te transaction is being linked does not exist.`,
      );

    if (!account.isActive)
      throw new ConflictException(
        'The account where the transaction is being created is inactive',
      );

    if (account.user.id !== userId)
      throw new BadRequestException(
        'The user added must be the owner of the account',
      );

    const transaction = this.transactionRepository.create({
      ...restDto,
      user: account.user,
      account,
      category,
    });
    transaction.amount = new Money(amount, currency);

    return this.transactionRepository.save(transaction);
  }

  findByAccountId(
    id: string,
    paginationDetails: Partial<PaginationDto> = { offset: 0, limit: 20 },
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { account: { id } },
      relations: ['category'],
      skip: paginationDetails.offset,
      take: paginationDetails.limit,
    });
  }

  findByUserId(
    id: string,
    paginationDetails: Partial<PaginationDto> = { offset: 0, limit: 20 },
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        account: { user: { id } },
      },
      relations: ['category', 'account'],
      skip: paginationDetails.offset,
      take: paginationDetails.limit,
    });
  }

  findByCategoryId(
    id: string,
    paginationDetails: Partial<PaginationDto> = { offset: 0, limit: 20 },
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        category: { id },
      },
      relations: ['account'],
      skip: paginationDetails.offset,
      take: paginationDetails.limit,
    });
  }

  findOne(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['account', 'category'],
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
