import { type currencyCode } from 'src/domain/types/currencyCode.type';
import { User } from 'src/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryColumn('uuid')
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

  // TODO @OneToMany(CATEGORIES)

  // TODO @OneToMany(BUDGETS)
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
