import { getRepository } from 'typeorm';
import { Wallet } from '../entities/Wallet';
import { GeneralError } from '../../classes/general-error';
import { NotFoundError, BadRequestError } from '../../classes/http-errors';

export class walletCommands {
  static async findAllByUser(userId: number): Promise<Wallet[]> {
    try {
      const repo = getRepository(Wallet);
      return await repo.find({ where: { userId } });
    } catch (error) {
      throw new BadRequestError('Unable to fetch wallets');
    }
  }

  static async findByIdForUser(id: number, userId: number): Promise<Wallet> {
    try {
      const repo = getRepository(Wallet);
      const wallet = await repo.findOne({ where: { id, userId } });
      if (!wallet) throw new NotFoundError('Wallet not found');
      return wallet;
    } catch (error) {
      if (error instanceof GeneralError) throw error;
      throw new BadRequestError('Unable to fetch wallet');
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
      throw new BadRequestError('Unable to create wallet');
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
      throw new BadRequestError('Unable to update wallet');
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
      throw new BadRequestError('Unable to delete wallet');
    }
  }
}
