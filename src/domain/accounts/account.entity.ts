import { type currencyCode } from '@domain/types/currencyCode.type';
import { User } from '@domain/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 3,
  })
  name: string;

  @Column('varchar')
  currency: currencyCode;

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  // TODO @OneToMany(TRANSACTIONS)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
