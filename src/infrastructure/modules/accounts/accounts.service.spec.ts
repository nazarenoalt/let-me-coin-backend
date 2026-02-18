import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from '@application/accounts/accounts.service';
import { ACCOUNTS_REPOSITORY } from '@domain/accounts/interfaces/accounts.repository.interface';

describe('AccountsService', () => {
  let service: AccountsService;

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
      providers: [
        AccountsService,
        {
          provide: ACCOUNTS_REPOSITORY,
          useValue: mockAccountsRepository, // 👈 mock plano, sin dependencias
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
