import supertest from 'supertest';
import { DataSource, Repository } from 'typeorm';

import { AppDataSource } from '../orm/data-source';
import { dbCreateConnection } from '../orm/dbCreateConnection';
import { User } from '../orm/entities/User';
import { Wallet } from '../orm/entities/Wallet';

describe('wallets module', () => {
  let dbConnection: DataSource;
  let userRepository: Repository<User>;
  let walletRepository: Repository<Wallet>;
  let user: User;
  let token: string;

  beforeAll(async () => {
    dbConnection = (await dbCreateConnection()) as DataSource;
    userRepository = AppDataSource.getRepository(User);
    walletRepository = AppDataSource.getRepository(Wallet);
    // Reuse seeded user
    const existing = await userRepository.findOne({
      where: { email: 'wallet@test.com' }
    });
    if (!existing) {
      // Fallback: create only if seed not present
      const u = new User();
      u.username = 'wallet_tester';
      u.name = 'Wallet Tester';
      u.email = 'wallet@test.com';
      u.password = 'pass1';
      u.hashPassword();
      user = await userRepository.save(u);
    } else {
      user = existing;
    }

    const { default: app } = await import('../../app');
    const res = await supertest(app)
      .post('/api/auth/signin')
      .send({ email: user.email, password: 'pass1' });
    // Debug logging removed; assertions will cover failures
    token = res.body.token;
  });

  afterAll(async () => {
    await walletRepository
      .createQueryBuilder()
      .delete()
      .from(Wallet)
      .where('userId = :id', { id: user.id })
      .execute();
    // Keep seeded user; just cleanup wallets
    // await userRepository.delete(user.id);
    if (dbConnection && dbConnection.isInitialized)
      await dbConnection.destroy();
  });

  test('CRUD wallets', async () => {
    const { default: app } = await import('../../app');

    const address = `0x${Date.now().toString(16)}_${Math.random()
      .toString(16)
      .slice(2)}`;

    const created = await supertest(app)
      .post('/api/wallets')
      .set({ Authorization: token })
      .send({ tag: 'primary', chain: 'ethereum', address });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const list = await supertest(app)
      .get('/api/wallets')
      .set({ Authorization: token });
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);

    const detail = await supertest(app)
      .get(`/api/wallets/${id}`)
      .set({ Authorization: token });
    expect(detail.status).toBe(200);
    expect(detail.body.address).toBe(address);

    const updated = await supertest(app)
      .put(`/api/wallets/${id}`)
      .set({ Authorization: token })
      .send({ tag: 'primary-2', chain: 'ethereum', address });
    expect(updated.status).toBe(200);

    const removed = await supertest(app)
      .delete(`/api/wallets/${id}`)
      .set({ Authorization: token });
    expect(removed.status).toBe(204);
  });
});
