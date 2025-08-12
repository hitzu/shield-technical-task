import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  DeleteDateColumn
} from 'typeorm';

import { User } from './User';

@Entity('wallets')
@Unique(['address'])
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  tag: string | null;

  @Column()
  chain: string;

  @Column()
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({
    nullable: true
  })
  @DeleteDateColumn()
  deleted_at: Date;
}
