import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { createMockUser } from 'src/common/test-data/user.factory';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
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
