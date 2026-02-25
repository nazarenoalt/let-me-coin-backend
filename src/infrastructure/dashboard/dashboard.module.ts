import { Module } from '@nestjs/common';
import { DashboardService } from 'src/application/dashboards/dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
