import { User } from '../entities/User';
import { GeneralError } from '../../classes/general-error';
import { AppDataSource } from '../data-source';

export class userCommands {
  static async getUserByEmail(email: string): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOne({ where: { email } });
    } catch (error) {
      const customError = new GeneralError(error, 'Error', 400);
      throw customError;
    }
  }
}
