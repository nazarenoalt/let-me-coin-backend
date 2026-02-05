import { Account } from '@domain/accounts/account.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'jsonb', nullable: false })
  details: IuserDetails;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @OneToMany(() => Account, (accounts) => accounts.user)
  accounts: Account[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  configureUserDetails() {
    if (!this.details) {
      this.details = {
        enabled: true,
        type: USERTYPE.Standard,
      };
    }
  }
}

export interface IuserDetails {
  enabled: boolean;
  type: USERTYPE;
}

export enum USERTYPE {
  Standard = 'standard',
  Experimental = 'experimental',
}
