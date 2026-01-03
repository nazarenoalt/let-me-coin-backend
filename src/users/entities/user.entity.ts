import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', length: 100 })
  firstName: string;

  @Column({ type: 'text', length: 100 })
  lastName: string;

  @Column({ type: 'text', length: 100 })
  email;

  @Column({ type: 'text', length: 100 })
  Password;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
