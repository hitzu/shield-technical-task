import argon2 from 'argon2';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    unique: true
  })
  username: string;

  @Column({
    nullable: true
  })
  name: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @Column({
    nullable: true
  })
  @DeleteDateColumn()
  deleted_at: Date;

  async hashPassword(): Promise<void> {
    this.password = await argon2.hash(this.password, { type: argon2.argon2id });
  }

  async checkIfPasswordMatch(plain: string): Promise<boolean> {
    if (this.password.startsWith('$argon2')) {
      return argon2.verify(this.password, plain);
    }
    return argon2.verify(this.password, plain);
  }
}
