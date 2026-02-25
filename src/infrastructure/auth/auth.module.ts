import { Module } from '@nestjs/common';
import { AuthService } from '@application/auth/auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
