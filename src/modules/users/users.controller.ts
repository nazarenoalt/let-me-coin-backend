import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../domain/users/dto/create-user.dto';
import { UpdateUserDto } from '../../domain/users/dto/update-user.dto';
import { PaginationUserDto } from '../../domain/users/dto';
import { BulkUpdateUserDto } from '../../domain/users/dto/bulk-update-users.dto';
import { BulkRemoveUsersDto } from '../../domain/users/dto/bulk-remove-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() pagination: Partial<PaginationUserDto>) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('bulk')
  updateMany(@Body() dto: BulkUpdateUserDto) {
    return this.usersService.updateMany(dto.ids, dto.data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('bulk')
  removeMany(
    @Body()
    dto: BulkRemoveUsersDto,
  ) {
    return this.usersService.removeMany(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
