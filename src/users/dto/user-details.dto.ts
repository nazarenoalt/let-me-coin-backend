import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export enum USERTYPE {
  Standard = 'standard',
  Experimental = 'experimental',
}

export class UserDetailsDto {
  @IsBoolean()
  @IsOptional()
  enabled: boolean;

  @IsEnum(USERTYPE)
  @IsOptional()
  type: USERTYPE;
}
