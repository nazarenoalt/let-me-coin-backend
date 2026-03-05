import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TransactionsService } from '@application/transactions/transactions.service';
import { CreateTransactionDto } from '@domain/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@domain/transactions/dto/update-transaction.dto';
import { BulkRemoveTransactionsDto } from '@domain/transactions/dto/bulk-remove-transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get(':accountId')
  findByAccountId(@Param('accountId', ParseUUIDPipe) accountId: string) {
    return this.transactionsService.findByAccountId(accountId);
  }

  @Get(':userId')
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.transactionsService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Body() dto: BulkRemoveTransactionsDto) {
    return this.transactionsService.remove(dto.ids);
  }
}
