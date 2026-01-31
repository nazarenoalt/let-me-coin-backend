import { IsArray, IsUUID } from 'class-validator';

export class BulkRemoveUsersDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}
