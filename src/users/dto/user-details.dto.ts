import { IsBoolean, IsEnum } from 'class-validator';

export enum USERTYPE {
  Standard = 'standard',
  Experimental = 'experimental',
}

export class UserDetailsDto {
  @IsBoolean()
  enabled: boolean;

  @IsEnum(USERTYPE)
  type: USERTYPE;
}
