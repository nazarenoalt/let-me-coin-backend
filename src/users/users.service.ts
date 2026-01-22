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
      await this.userRepository.update(id, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ where: { id } });
      if (!updatedUser)
        throw new NotFoundException(
          `User with id ${id} not found after update.`,
        );
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  // TODO
  async removeMany() {}

  // TODO
  async updateMany() {}

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    try {
      return await this.userRepository.remove(user);
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  exceptionHandler(error) {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException('Duplicate entry detected.');
    }

    throw new InternalServerErrorException(
      'An unexpected error ocurred on the server',
    );
  }
}
