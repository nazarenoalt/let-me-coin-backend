import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@infrastructure/modules/auth/auth.module';
import { UsersModule } from '@infrastructure/modules/users/users.module';
import { CategoriesModule } from '@infrastructure/modules/categories/categories.module';
import { BudgetsModule } from '@infrastructure/modules/budgets/budgets.module';
import { TransactionsModule } from '@infrastructure/modules/transactions/transactions.module';
import { DashboardModule } from '@infrastructure/modules/dashboard/dashboard.module';
import { CommonModule } from '@infrastructure/modules/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '9295', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.ENVIRONMENT !== 'production' && true,
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    BudgetsModule,
    TransactionsModule,
    DashboardModule,
    CommonModule,
<<<<<<< HEAD
    DatabaseModule,
    AccountsModule,
=======
>>>>>>> origin/main
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
