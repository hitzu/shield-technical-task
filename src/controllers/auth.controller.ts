import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { userCommands } from '../orm/commands/user';
import { GeneralError } from '../classes/general-error';
import { ConflictError, UnauthorizedError } from '../classes/http-errors';
import { generate } from '../services/token';
import { User } from '../orm/entities/User';

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

export const signOut = async (_req: Request, res: Response) => {
  res.status(200).json({ success: true });
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

    const userRepository = getRepository(User);
    const newUser = userRepository.create({ email, password, username, name });
    newUser.hashPassword();
    const savedUser = await userRepository.save(newUser);

    res.status(201).json({
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      name: savedUser.name,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at
    });
  } catch (error) {
    next(error);
  }
};
