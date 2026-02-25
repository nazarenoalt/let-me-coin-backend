import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@infrastructure/users/users.controller';
import { UsersService } from '@application/users/users.service';
import { createMockUser } from '@infrastructure/common/test-data/user.factory';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    remove: jest.fn(),
    removeMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get(UsersService);
    controller = module.get(UsersController);
  });

  describe('findAll', () => {
    it('show throw an array with users', async () => {
      const result = [createMockUser(), createMockUser()];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.findAll({})).toBe(result);
    });
  });
});
