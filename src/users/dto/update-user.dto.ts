import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ValidateNested()
  @Type(() => UserDetailsDto)
  @IsOptional()
  details: UserDetailsDto;
}
