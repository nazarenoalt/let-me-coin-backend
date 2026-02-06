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
import { AccountsService } from '@application/accounts/accounts.service';
import { CreateAccountDto } from '@domain/accounts/dto/create-account.dto';
import { UpdateAccountDto } from '@domain/accounts/dto/update-account.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // TODO: When the authentication module is complete, replace the userId retrieval from the body to the request
  @Post()
  create(@Body() userId: string, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(userId, dto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.accountsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountsService.remove(id);
  }
}
