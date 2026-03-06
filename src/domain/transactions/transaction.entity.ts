import { Account } from '@domain/accounts/account.entity';
import { type TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import { Money } from '@shared/domain/value-objects/Money';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'int', name: 'amount' })
  private _amount: number;

  @Column({ type: 'varchar', length: 3, name: 'currency' })
  private _currency: TcurrencyCode;

  @ManyToOne(() => Account, (accounts) => accounts.transactions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  account: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get amount(): Money {
    const amount = Money.toStringWithCents(this._amount, this.currency);
    return new Money(amount, this.currency);
  }

  get currency(): TcurrencyCode {
    return this._currency;
  }

  set amount(money: Money) {
    if (money.currency.code !== this._currency && this._currency !== undefined)
      throw new Error('Error adding an amount: The currencies must be equal.');
    this._amount = money.getAbsoluteAmount();
    this._currency = money.getCurrency().code;
  }
}
