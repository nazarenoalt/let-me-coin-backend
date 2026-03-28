import { Transaction } from '@domain/transactions/transaction.entity';
import { User } from '@domain/users/user.entity';
import { COLORS } from '@shared/domain/constants/colors.const';
import { CURRENCY_CODES } from '@shared/domain/constants/currency.const';
import { EMOJIS } from '@shared/domain/constants/emojis.const';
import type { TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['title', 'user'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'enum', enum: COLORS, default: COLORS.YELLOW })
  color: COLORS;

  @Column({ type: 'enum', enum: EMOJIS, default: EMOJIS.GROCERIES })
  emoji: EMOJIS;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

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
