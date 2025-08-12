import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class SeedMoreData1700000000002 implements MigrationInterface {
  name = 'SeedMoreData1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const pass1 = bcrypt.hashSync('pass1', 8);
    const pass2 = bcrypt.hashSync('pass2', 8);
    const pass3 = bcrypt.hashSync('pass3', 8);

    await queryRunner.query(
      `INSERT INTO users (username, name, email, password) VALUES
        ('user1', 'User One', 'user1@example.com', '${pass1}'),
        ('user2', 'User Two', 'user2@example.com', '${pass2}'),
        ('user3', 'User Three', 'user3@example.com', '${pass3}')
      ON CONFLICT (email) DO NOTHING;`
    );

    // Wallets for tester and user1
    await queryRunner.query(
      `INSERT INTO wallets (user_id, tag, chain, address)
       SELECT id, 'primary', 'ethereum', '0xabc123' FROM users WHERE email='wallet@test.com'
       ON CONFLICT (address) DO NOTHING;`
    );
    await queryRunner.query(
      `INSERT INTO wallets (user_id, tag, chain, address)
       SELECT id, 'savings', 'bitcoin', 'bc1qxyz' FROM users WHERE email='user1@example.com'
       ON CONFLICT (address) DO NOTHING;`
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
