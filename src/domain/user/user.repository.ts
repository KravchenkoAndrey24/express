import { ForgotPasswordStep2InDto, SignInInDto } from '../auth/auth.dto';
import { User } from '../../entities/User.entity';
import AppDataSource from '../../typeOrm.config';
import { UserInDto, UserOutDto } from './user.dto';
import { userDBMapper } from './user.mappers';
import { sessionRepository } from '../session/session.repository';
import { temporaryUserTokenRepository } from '../temporary-user-token/temporaryUserToken.repository';

const userDBRepository = AppDataSource.getRepository(User);

export const userRepository = {
  async createUser(data: UserInDto): Promise<UserOutDto> {
    return userDBMapper(await userDBRepository.save(data));
  },
  async updatePassword({ email, newPassword }: Omit<ForgotPasswordStep2InDto, 'token'>): Promise<UserOutDto | null> {
    const foundUser = await userRepository.findUserByEmail(email);
    if (!foundUser) {
      return null;
    }
    await userDBRepository.update(foundUser.id, { password: newPassword });
    await temporaryUserTokenRepository.deleteTokensForUser(foundUser);
    await sessionRepository.deleteSessionByUser(foundUser);
    return foundUser;
  },
  async findUserForSignIn(data: SignInInDto): Promise<UserOutDto | null> {
    const foundUser = await userDBRepository.findOne({
      where: { email: data.email, password: data.password },
    });
    return foundUser ? userDBMapper(foundUser) : null;
  },
  async findUserByEmail(email: string): Promise<UserOutDto | null> {
    const foundUser = await userDBRepository.findOne({
      where: { email },
    });
    return foundUser ? userDBMapper(foundUser) : null;
  },
};
