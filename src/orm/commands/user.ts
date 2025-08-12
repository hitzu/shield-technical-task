import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { GeneralError } from '../../classes/general-error';

export class userCommands {
  static async getUserByEmail(email: string): Promise<User> {
    try {
      const userRepository = getRepository(User);
      return await userRepository.findOne({ where: { email } });
    } catch (error) {
      const customError = new GeneralError(error, 'Error', 400);
      throw customError;
    }
  }
}
