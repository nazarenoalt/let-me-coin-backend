import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from '@infrastructure/accounts/accounts.controller';
import { AccountsService } from '@application/accounts/accounts.service';
import { ACCOUNTS_REPOSITORY } from '@domain/accounts/interfaces/accounts.repository.interface';
describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const mockAccountsRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        {
          provide: ACCOUNTS_REPOSITORY,
          useValue: mockAccountsRepository,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
