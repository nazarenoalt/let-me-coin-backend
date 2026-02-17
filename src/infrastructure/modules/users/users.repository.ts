import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/users/user.entity';
import { CreateUserDto, UpdateUserDto } from '@domain/users/dto';
import { BulkRemoveUsersDto } from '@domain/users/dto/bulk-remove-users.dto';
import { cleanObject } from '@infrastructure/modules/common/helpers/object.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DeleteResult } from 'typeorm/browser';
import { Account } from '@domain/accounts/account.entity';
import { IUsersRepository } from '@domain/users/interfaces/user.repository.interface';
import { CURRENCY } from '@domain/constants/currency.const';
import { UpdateResult } from 'typeorm/browser';
@Injectable()
export class UsersRepository implements IUsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(User)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...dto,
      accounts: [
        {
          name: `${dto.firstName}'s account`,
          currency: CURRENCY.ARS.code,
        },
      ],
    });
    return await this.userRepository.save(user);
  }

  async findAll({
    offset = 0,
    limit = 50,
  }: Partial<PaginationDto>): Promise<User[]> {
    return this.userRepository.find({
      skip: offset,
      take: limit,
      relations: ['accounts'],
    });
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['accounts'],
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        details: () => 'details || :newDetails::jsonb',
      })
      .setParameter('newDetails', JSON.stringify(cleanObject(dto.details)))
      .where('id = :id', { id })
      .execute();
  }

  async updateMany(ids: string[], dto: UpdateUserDto): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        details: () => 'details || :newDetails::jsonb',
      })
      .setParameter('newDetails', JSON.stringify(cleanObject(dto.details)))
      .where('id IN (:...ids)', { ids })
      .execute();
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }

  async removeMany({ ids }: BulkRemoveUsersDto): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
