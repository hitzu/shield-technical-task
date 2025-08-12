import supertest from 'supertest';
import { Connection, getRepository, Repository } from 'typeorm';
import { dbCreateConnection } from '../orm/dbCreateConnection';
import { User } from '../orm/entities/User';
import { Wallet } from '../orm/entities/Wallet';

describe('wallets module', () => {
  let dbConnection: Connection;
  let userRepository: Repository<User>;
  let walletRepository: Repository<Wallet>;
  let user: User;
  let token: string;

  beforeAll(async () => {
    dbConnection = (await dbCreateConnection()) as Connection;
    userRepository = getRepository(User);
    walletRepository = getRepository(Wallet);
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

    const app = require('../../app');
    const res = await supertest(app)
      .post('/api/auth/signin')
      .send({ email: user.email, password: 'pass1' });
    // Debug signin
    // eslint-disable-next-line no-console
    console.log('signin status:', res.status, 'body:', res.body);
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
    if (dbConnection && dbConnection.isConnected) {
      await dbConnection.close();
    }
  });

  test('CRUD wallets', async () => {
    const app = require('../../app');

    const created = await supertest(app)
      .post('/api/wallets')
      .set({ Authorization: token })
      .send({ tag: 'primary', chain: 'ethereum', address: '0xabc123' });
    // eslint-disable-next-line no-console
    console.log('create wallet status:', created.status, 'body:', created.body);
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
    expect(detail.body.address).toBe('0xabc123');

    const updated = await supertest(app)
      .put(`/api/wallets/${id}`)
      .set({ Authorization: token })
      .send({ tag: 'primary-2', chain: 'ethereum', address: '0xabc123' });
    expect(updated.status).toBe(200);

    const removed = await supertest(app)
      .delete(`/api/wallets/${id}`)
      .set({ Authorization: token });
    expect(removed.status).toBe(204);
  });
});
