import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@application/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { User } from '@domain/users/user.entity';
import { CreateUserDto, UpdateUserDto } from '@domain/users/dto';
import { BulkRemoveUsersDto } from '@domain/users/dto/bulk-remove-users.dto';
import { USERS_REPOSITORY } from '@domain/users/interfaces/user.repository.interface';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
    remove: jest.Mock;
    removeMany: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
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
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // ══════════════════════════════════════════════════════════
  // create
  // ══════════════════════════════════════════════════════════

  describe('create', () => {
    it('should delegate to repository and return the new user', async () => {
      const dto: CreateUserDto = { email: 'test@example.com' } as any;
      const user: User = { id: '1', ...dto } as any;

      mockUsersRepository.create.mockResolvedValue(user);

      await expect(service.create(dto)).resolves.toEqual(user);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(dto);
    });

    it('should bubble up repository errors without transforming them', async () => {
      const dto: CreateUserDto = { email: 'test@example.com' } as any;
      const dbError = Object.assign(new Error('db error'), { code: '23505' });

      mockUsersRepository.create.mockRejectedValue(dbError);

      await expect(service.create(dto)).rejects.toMatchObject({
        code: '23505',
      });
    });
  });

  // ══════════════════════════════════════════════════════════
  // findAll
  // ══════════════════════════════════════════════════════════

  describe('findAll', () => {
    it('should delegate to repository with the received pagination', async () => {
      const users: User[] = [{ id: '1', email: 'test@example.com' } as any];

      mockUsersRepository.findAll.mockResolvedValue(users);

      await expect(service.findAll({ offset: 0, limit: 50 })).resolves.toEqual(
        users,
      );
      expect(mockUsersRepository.findAll).toHaveBeenCalledWith({
        offset: 0,
        limit: 50,
      });
    });

    it('should work with an empty pagination object', async () => {
      mockUsersRepository.findAll.mockResolvedValue([]);

      await expect(service.findAll({})).resolves.toEqual([]);
      expect(mockUsersRepository.findAll).toHaveBeenCalledWith({});
    });
  });

  // ══════════════════════════════════════════════════════════
  // findOne
  // ══════════════════════════════════════════════════════════

  describe('findOne', () => {
    it('should return the user when the repository finds it', async () => {
      const user: User = { id: '1', email: 'test@example.com' } as any;

      mockUsersRepository.findOne.mockResolvedValue(user);

      await expect(service.findOne('1')).resolves.toEqual(user);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('NotFoundException message should include the requested id', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('abc-123')).rejects.toThrow('abc-123');
    });
  });

  // ══════════════════════════════════════════════════════════
  // update
  // ══════════════════════════════════════════════════════════

  describe('update', () => {
    it('should return an UpdateResults object when the user exists', async () => {
      const dto: UpdateUserDto = { details: { name: 'John' } } as any;
      const result: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };

      mockUsersRepository.update.mockResolvedValue(result);

      await expect(service.update('1', dto)).resolves.toEqual(result);
      expect(mockUsersRepository.update).toHaveBeenCalledWith('1', dto);
    });

    it('should throw NotFoundException when no rows were affected', async () => {
      const dto: UpdateUserDto = { details: { name: 'John' } } as any;
      const result: UpdateResult = { affected: 0, raw: [], generatedMaps: [] };

      mockUsersRepository.update.mockResolvedValue(result);

      await expect(service.update('1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should bubble up repository errors without transforming them', async () => {
      const dto: UpdateUserDto = { details: { name: 'John' } } as any;
      const dbError = Object.assign(new Error('db error'), { code: '23505' });

      mockUsersRepository.update.mockRejectedValue(dbError);

      await expect(service.update('1', dto)).rejects.toMatchObject({
        code: '23505',
      });
    });
  });

  // ══════════════════════════════════════════════════════════
  // updateMany
  // ══════════════════════════════════════════════════════════

  describe('updateMany', () => {
    it('should delegate to repository and return UpdateResult', async () => {
      const ids = ['1', '2'];
      const dto: UpdateUserDto = { details: { name: 'John' } } as any;
      const result: UpdateResult = { affected: 2, raw: [], generatedMaps: [] };

      mockUsersRepository.updateMany.mockResolvedValue(result);

      await expect(service.updateMany(ids, dto)).resolves.toEqual(result);
      expect(mockUsersRepository.updateMany).toHaveBeenCalledWith(ids, dto);
    });

    it('should bubble up repository errors without transforming them', async () => {
      const ids = ['1', '2'];
      const dto: UpdateUserDto = { details: { name: 'John' } } as any;
      const dbError = Object.assign(new Error('db error'), { code: '23505' });

      mockUsersRepository.updateMany.mockRejectedValue(dbError);

      await expect(service.updateMany(ids, dto)).rejects.toMatchObject({
        code: '23505',
      });
    });
  });

  // ══════════════════════════════════════════════════════════
  // remove
  // ══════════════════════════════════════════════════════════

  describe('remove', () => {
    it('should delegate to repository and return DeleteResult', async () => {
      const user: User = { id: '1', email: 'test@example.com' } as any;
      const result: DeleteResult = { affected: 1, raw: [] };

      mockUsersRepository.findOne.mockResolvedValue(user); // 👈 agregaste esto
      mockUsersRepository.remove.mockResolvedValue(result);

      await expect(service.remove('1')).resolves.toEqual(result);
      expect(mockUsersRepository.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when no rows were affected', async () => {
      const result: DeleteResult = { affected: 0, raw: [] };

      mockUsersRepository.remove.mockResolvedValue(result);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  // ══════════════════════════════════════════════════════════
  // removeMany
  // ══════════════════════════════════════════════════════════

  describe('removeMany', () => {
    it('should delegate to repository and return DeleteResult', async () => {
      const dto: BulkRemoveUsersDto = { ids: ['1', '2'] };
      const result: DeleteResult = { affected: 2, raw: [] };

      mockUsersRepository.removeMany.mockResolvedValue(result);

      await expect(service.removeMany(dto)).resolves.toEqual(result);
      expect(mockUsersRepository.removeMany).toHaveBeenCalledWith(dto);
    });

    it('should bubble up repository errors without transforming them', async () => {
      const dto: BulkRemoveUsersDto = { ids: ['1', '2'] };
      const dbError = Object.assign(new Error('db error'), { code: '23503' });

      mockUsersRepository.removeMany.mockRejectedValue(dbError);

      await expect(service.removeMany(dto)).rejects.toMatchObject({
        code: '23503',
      });
    });
  });
});
