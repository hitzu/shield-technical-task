import { getRepository } from 'typeorm';
import { Wallet } from '../entities/Wallet';
import { GeneralError } from '../../classes/general-error';

export class walletCommands {
  static async findAllByUser(userId: number): Promise<Wallet[]> {
    try {
      const repo = getRepository(Wallet);
      return await repo.find({ where: { userId } });
    } catch (error) {
      throw new GeneralError(error, 'Unable to fetch wallets', 400);
    }
  }

  static async findByIdForUser(id: number, userId: number): Promise<Wallet> {
    try {
      const repo = getRepository(Wallet);
      const wallet = await repo.findOne({ where: { id, userId } });
      if (!wallet)
        throw new GeneralError(new Error('Not found'), 'Not found', 404);
      return wallet;
    } catch (error) {
      if (error instanceof GeneralError) throw error;
      throw new GeneralError(error, 'Unable to fetch wallet', 400);
    }
  }

  static async createForUser(
    userId: number,
    data: Pick<Wallet, 'tag' | 'chain' | 'address'>
  ): Promise<Wallet> {
    try {
      const repo = getRepository(Wallet);
      const entity = repo.create({ ...data, userId });
      return await repo.save(entity);
    } catch (error) {
      throw new GeneralError(error, 'Unable to create wallet', 400);
    }
  }

  static async updateForUser(
    id: number,
    userId: number,
    data: Partial<Pick<Wallet, 'tag' | 'chain' | 'address'>>
  ): Promise<Wallet> {
    try {
      const repo = getRepository(Wallet);
      const wallet = await this.findByIdForUser(id, userId);
      Object.assign(wallet, data);
      return await repo.save(wallet);
    } catch (error) {
      if (error instanceof GeneralError) throw error;
      throw new GeneralError(error, 'Unable to update wallet', 400);
    }
  }

  static async deleteForUser(id: number, userId: number): Promise<void> {
    try {
      const repo = getRepository(Wallet);
      // Ensure the wallet exists and belongs to user
      await this.findByIdForUser(id, userId);
      // Soft delete to set deleted_at instead of hard delete
      await repo.softDelete({ id, userId });
    } catch (error) {
      if (error instanceof GeneralError) throw error;
      throw new GeneralError(error, 'Unable to delete wallet', 400);
    }
  }
}
