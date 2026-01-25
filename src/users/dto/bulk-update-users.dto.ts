import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';

export class BulkUpdateUserDto {
  @IsUUID('4', { each: true })
  ids: string[];

  @ValidateNested()
  @Type(() => UpdateUserDto)
  data: UpdateUserDto;
}
