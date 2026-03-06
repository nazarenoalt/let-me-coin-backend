import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '@infrastructure/transactions/transactions.controller';
import { TransactionsService } from '@application/transactions/transactions.service';
import { TRANSACTIONS_REPOSITORY } from '@domain/transactions/interfaces/transactionsRepository.interface';
import { TransactionsRepository } from '@infrastructure/transactions/transactions.repository';
import { ACCOUNTS_REPOSITORY } from '@domain/accounts/interfaces/accounts.repository.interface';
import { AccountsRepository } from '@infrastructure/accounts/accounts.repository';
import { USERS_REPOSITORY } from '@domain/users/interfaces/user.repository.interface';
import { UsersRepository } from '@infrastructure/users/users.repository';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        {
          provide: TRANSACTIONS_REPOSITORY,
          useClass: TransactionsRepository,
        },
        {
          provide: ACCOUNTS_REPOSITORY,
          useClass: AccountsRepository,
        },
        {
          provide: USERS_REPOSITORY,
          useClass: UsersRepository,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
