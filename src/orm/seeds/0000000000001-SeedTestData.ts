import { MigrationInterface, QueryRunner } from 'typeorm';
import argon2 from 'argon2';

export class SeedTestData1700000000001 implements MigrationInterface {
  name = 'SeedTestData1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hash = await argon2.hash('pass1', { type: argon2.argon2id });
    await queryRunner.query(
      `INSERT INTO users (username, name, email, password) VALUES ('tester', 'Tester', 'wallet@test.com', '${hash}') ON CONFLICT (email) DO NOTHING;`
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
