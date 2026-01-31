import { Module } from '@nestjs/common';
import { DashboardService } from '@applications/sdashboards/dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
