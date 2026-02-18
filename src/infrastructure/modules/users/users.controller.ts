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
import { UsersService } from '@application/users/users.service';
import { CreateUserDto } from '@domain/users/dto/create-user.dto';
import { UpdateUserDto } from '@domain/users/dto/update-user.dto';
import { BulkUpdateUserDto } from '@domain/users/dto/bulk-update-users.dto';
import { BulkRemoveUsersDto } from '@domain/users/dto/bulk-remove-users.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() pagination: Partial<PaginationDto>) {
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
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    // aca ya el dto recibe details: undefined.
    // UpdateUserDto { details: undefined, firstName: 'laluaso' }
    console.log(dto);
    return this.usersService.update(id, dto);
  }

  @Delete('bulk')
  removeMany(@Body() dto: BulkRemoveUsersDto) {
    return this.usersService.removeMany(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
