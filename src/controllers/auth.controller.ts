import { Request, Response, NextFunction } from 'express';

import { ConflictError, UnauthorizedError } from '../classes/http-errors';
import { userCommands } from '../orm/commands/user';
import { AppDataSource } from '../orm/data-source';
import { User } from '../orm/entities/User';
import { decode, generate } from '../services/token';
import { blacklistJti } from '../services/token-blacklist';

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userCommands.getUserByEmail(email);
    if (!user || !user.checkIfPasswordMatch(password)) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const token = await generate(user.id, user.email, 'active');
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = (req.headers.authorization || '').toString();
    const token = header.toLowerCase().startsWith('bearer ')
      ? header.split(' ')[1]
      : header;
    const payload: any = await decode(token);
    if (payload?.jti && payload?.exp) {
      const now = Math.floor(Date.now() / 1000);
      const ttl = Math.max(1, payload.exp - now);
      await blacklistJti(payload.jti, ttl);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username, name } = req.body;

    const existingUser = await userCommands.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create({ email, password, username, name });
    newUser.hashPassword();
    const savedUser = await userRepository.save(newUser);

    res.status(201).json({
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      name: savedUser.name,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at,
      token: generate(savedUser.id, savedUser.email, 'active')
    });
  } catch (error) {
    next(error);
  }
};
