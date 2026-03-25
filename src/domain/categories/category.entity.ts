import { Transaction } from '@domain/transactions/transaction.entity';
import { User } from '@domain/users/user.entity';
import { CURRENCY_CODES } from '@shared/domain/constants/currency.const';
import type { TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @Column({ type: 'varchar', length: 50 })
  emoji: string;

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;

  @OneToMany(() => Transaction, (transactions) => transactions.category)
  transactions: Transaction[];

  @Column({ type: 'varchar', length: 3, enum: CURRENCY_CODES })
  currency: TcurrencyCode;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
