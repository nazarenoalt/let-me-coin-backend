import { IsArray, IsUUID } from 'class-validator';

export class BulkRemoveTransactionsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}
