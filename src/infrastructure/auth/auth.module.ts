import { Module } from '@nestjs/common';
import { AuthService } from '@application/auth/auth.service';
import { AuthController } from '../../tests/infrastructure/auth/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
