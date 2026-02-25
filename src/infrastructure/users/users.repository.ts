import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/users/user.entity';
import { CreateUserDto, UpdateUserDto } from '@domain/users/dto';
import { BulkRemoveUsersDto } from '@domain/users/dto/bulk-remove-users.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DeleteResult } from 'typeorm/browser';
import { IUsersRepository } from '@domain/users/interfaces/user.repository.interface';
import { CURRENCY } from 'src/shared/domain/constants/currency.const';
@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const { details, ...restDto } = dto;
    const query = this.userRepository.createQueryBuilder().update(User);

    if (details) {
      query.set({
        ...restDto,
        details: () => 'details || :newDetails::jsonb',
      });
      query.setParameter('newDetails', JSON.stringify(details));
    } else {
      query.set(restDto);
    }
    return await query.where('id = :id', { id }).execute();
  }

  async updateMany(ids: string[], dto: UpdateUserDto) {
    const { details, ...restDto } = dto;
    const query = this.userRepository.createQueryBuilder().update(User);

    if (details) {
      query.set({
        ...restDto,
        details: () => 'details || :newDetails::jsonb',
      });
      query.setParameter('newDetails', JSON.stringify(details));
    } else {
      query.set(restDto);
    }
    return await query.where('id IN (:...ids)', { ids }).execute();
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }

  async removeMany({ ids }: BulkRemoveUsersDto) {
    return await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
