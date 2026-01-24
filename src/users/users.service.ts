/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, PaginationUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { cleanObject } from 'src/common/helpers/object.helper';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(error);

      if (error.code == '23505') {
        throw new BadRequestException(error.detail);
      }
      this.exceptionHandler(error);
    }
  }

  async findAll({ offset = 0, limit = 50 }: PaginationUserDto) {
    return await this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found.`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          details: () => 'details || :newDetails::jsonb',
        })
        .setParameter(
          'newDetails',
          JSON.stringify(cleanObject(updateUserDto.details)),
        )
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  async updateMany(ids: string[], data: UpdateUserDto) {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          details: () => 'details || :newDetails::jsonb',
        })
        .setParameter('newDetails', JSON.stringify(cleanObject(data.details)))
        .where('id IN (:...ids)', { ids })
        .execute();
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  // TODOe
  async removeMany() {}

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    try {
      return await this.userRepository.remove(user);
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  // TODO: Create a global handler
  exceptionHandler(error) {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException('Duplicate entry detected.');
    }
    if (error.code === '02000') {
      throw new NotFoundException('User not found.');
    }

    throw new InternalServerErrorException(
      'An unexpected error ocurred on the server',
    );
  }
}
