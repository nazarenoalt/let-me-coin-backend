import { Module } from '@nestjs/common';
import { AccountsService } from '@application/accounts/accounts.service';
import { AccountsController } from './accounts.controller';
import { ACCOUNTS_REPOSITORY } from '@domain/accounts/interfaces/accounts.repository.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@domain/accounts/account.entity';
import { User } from '@domain/users/user.entity';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  controllers: [AccountsController],
  providers: [
    { provide: ACCOUNTS_REPOSITORY, useClass: AccountsRepository },
    AccountsService,
  ],
})
export class AccountsModule {}
