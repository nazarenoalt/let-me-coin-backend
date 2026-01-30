import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    default: 0,
  })
  amount: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  description: string;

  @Column('varchar')
  type: TRANSACTION_TYPE;

  @Column('varchar')
  currency: CURRENCY_TYPE;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

enum TRANSACTION_TYPE {
  Income = 'income',
  Outome = 'outcome',
}

enum CURRENCY_TYPE {
  // America
  USD = 'USD',
  CAD = 'CAD',

  // Latam
  MXN = 'MXN',
  ARS = 'ARS',
  UYU = 'UYU',
  COP = 'COP',
  BRL = 'BRL',
  CLP = 'CLP',
  // Europe
  EUR = 'EUR',
  GBP = 'GBP',
  CHF = 'CHF',

  // Asia
  JPY = 'JPY',
  CNY = 'CNY',
  KRW = 'KRW',
  INR = 'INR',

  // Other
  AUD = 'AUD',
}
