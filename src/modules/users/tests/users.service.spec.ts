import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../../../domain/users/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../../domain/users/dto';
import { BulkRemoveUsersDto } from '../../../domain/users/dto/bulk-remove-users.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' } as any;
      const user = { id: '1', ...createUserDto };

      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockResolvedValue(user);

      expect(await service.create(createUserDto)).toEqual(user);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException on duplicate entry', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' } as any;
      const error = { code: '23505', detail: 'duplicate key value' };

      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return users with default pagination', async () => {
      const users = [{ id: '1', email: 'test@example.com' }];

      mockUserRepository.find.mockResolvedValue(users);

      expect(await service.findAll({})).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 50,
      });
    });

    it('should return users with custom pagination', async () => {
      const users = [{ id: '2', email: 'test2@example.com' }];

      mockUserRepository.find.mockResolvedValue(users);

      expect(await service.findAll({ offset: 10, limit: 25 })).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        skip: 10,
        take: 25,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'test@example.com' };

      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await service.findOne('1')).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { details: { name: 'John' } } as any;
      const result = { affected: 1 };

      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(result),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      expect(await service.update(id, updateUserDto)).toEqual(result);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
    });

    it('should throw error on update failure', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { details: { name: 'John' } } as any;
      const error = { code: '23505' };

      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(error),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateMany', () => {
    it('should update multiple users', async () => {
      const ids = ['1', '2'];
      const data: UpdateUserDto = { details: { name: 'John' } } as any;
      const result = { affected: 2 };

      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(result),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      expect(await service.updateMany(ids, data)).toEqual(result);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id IN (:...ids)', {
        ids,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: '1', email: 'test@example.com' };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.remove.mockResolvedValue(user);

      expect(await service.remove('1')).toEqual(user);
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeMany', () => {
    it('should remove multiple users', async () => {
      const bulkRemoveDto: BulkRemoveUsersDto = { ids: ['1', '2'] };
      const result = { affected: 2 };

      const mockQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(result),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      expect(await service.removeMany(bulkRemoveDto)).toEqual(result);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id IN (:...ids)', {
        ids: bulkRemoveDto.ids,
      });
    });
  });

  describe('exceptionHandler', () => {
    it('should throw BadRequestException for duplicate entry', () => {
      const error = { code: '23505' };

      expect(() => service.exceptionHandler(error)).toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException for user not found', () => {
      const error = { code: '02000' };

      expect(() => service.exceptionHandler(error)).toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException for unknown error', () => {
      const error = { code: 'UNKNOWN' };

      expect(() => service.exceptionHandler(error)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
