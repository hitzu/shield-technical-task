import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class SeedTestData1700000000001 implements MigrationInterface {
  name = 'SeedTestData1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hash = bcrypt.hashSync('pass1', 8);
    await queryRunner.query(
      `INSERT INTO users (username, name, email, password) VALUES ('tester', 'Tester', 'wallet@test.com', '${hash}') ON CONFLICT (email) DO NOTHING;`
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
