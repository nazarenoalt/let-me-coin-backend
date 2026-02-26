import { ITransactionRepository } from '@domain/transactions/interfaces/transactionsRepository.interface';
import { Injectable } from '@nestjs/common';

const TRANSACTION_REPOSITORY = 'TransactionRepository';
@Injectable(TRANSACTION_REPOSITORY)
export class TransactionRepository implements ITransactionRepository {}
