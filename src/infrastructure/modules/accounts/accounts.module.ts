import { Module } from '@nestjs/common';
import { AccountsService } from '@application/accounts/accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
