import { Response, NextFunction } from 'express';

import { RequestCustom } from '../interfaces/start-options.interface';
import { walletCommands } from '../orm/commands/wallet';

export const listWallets = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.token.user_id);
    const wallets = await walletCommands.findAllByUser(userId);
    res.status(200).json(wallets);
  } catch (error) {
    next(error);
  }
};

export const getWallet = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.token.user_id);
    const id = Number(req.params.id);
    const wallet = await walletCommands.findByIdForUser(id, userId);
    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
};

export const createWallet = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.token.user_id);
    const { tag, chain, address } = req.body;
    const wallet = await walletCommands.createForUser(userId, {
      tag,
      chain,
      address
    });
    res.status(201).json(wallet);
  } catch (error) {
    next(error);
  }
};

export const updateWallet = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.token.user_id);
    const id = Number(req.params.id);
    const { tag, chain, address } = req.body;
    const wallet = await walletCommands.updateForUser(id, userId, {
      tag,
      chain,
      address
    });
    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
};

export const deleteWallet = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.token.user_id);
    const id = Number(req.params.id);
    await walletCommands.deleteForUser(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
