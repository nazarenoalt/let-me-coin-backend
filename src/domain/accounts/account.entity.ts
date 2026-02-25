import { type currencyCode } from '@shared/domain/types/currencyCode.type';
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

  // TODO @OneToMany(TRANSACTIONS)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
