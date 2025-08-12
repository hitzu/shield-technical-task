import { argon2id, hash } from 'argon2';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTestData1700000000001 implements MigrationInterface {
  name = 'SeedTestData1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashed = await hash('pass1', { type: argon2id });
    await queryRunner.query(
      `INSERT INTO users (username, name, email, password) VALUES ('tester', 'Tester', 'wallet@test.com', '${hashed}') ON CONFLICT (email) DO NOTHING;`
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
