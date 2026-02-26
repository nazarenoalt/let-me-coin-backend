import { type currencyCode } from '@shared/domain/types/currencyCode.type';
import { User } from '@domain/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '@domain/transactions/transaction.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 3,
  })
  currency: currencyCode;

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;

  @OneToMany(() => Transaction, (transactions) => transactions.account)
  transactions: Transaction[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
