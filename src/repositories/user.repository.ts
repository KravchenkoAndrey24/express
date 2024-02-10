import { ForgotPasswordOutDto, ForgotPasswordStep2InDto, SignInInDto } from '../auth/auth.dto';
import { randomSHA256String, sha256String } from '../crypro.utils';
import { ForgotPassword } from '../entities';
import { User } from '../entities/User.entity';
import AppDataSource from '../typeOrm.config';
import { UserInDto, UserOutDto } from '../user/user.dto';
import { userDBMapper } from '../user/user.mappers';
import { sessionRepository } from './session.repository';

const getUserDBRepository = () => AppDataSource.getRepository(User);
const getForgotPasswordDBRepository = () => AppDataSource.getRepository(ForgotPassword);

export const userRepository = {
  createUser: async (data: UserInDto): Promise<UserOutDto> => {
    return userDBMapper(await getUserDBRepository().save(data));
  },
  updatePassword: async ({
    email,
    newPassword,
  }: Omit<ForgotPasswordStep2InDto, 'token'>): Promise<UserOutDto | null> => {
    const foundUser = await getUserDBRepository().findOne({
      where: { email },
    });
    if (!foundUser) {
      return null;
    }
    await getUserDBRepository().update(foundUser.id, { password: newPassword });
    await getForgotPasswordDBRepository().delete({ user: foundUser });
    await sessionRepository.deleteSessionByUser(foundUser);
    return userDBMapper(foundUser);
  },
  findUserForSignIn: async (data: SignInInDto): Promise<UserOutDto | null> => {
    const foundUser = await getUserDBRepository().findOne({
      where: { email: data.email, password: sha256String(data.password) },
    });
    if (!foundUser) {
      return null;
    }
    return userDBMapper(foundUser);
  },
  findUserByEmail: async (email: string): Promise<UserOutDto | null> => {
    const foundUser = await getUserDBRepository().findOne({
      where: { email },
    });
    if (!foundUser) {
      return null;
    }
    return userDBMapper(foundUser);
  },
  createForgotPasswordToken: async (email: string): Promise<ForgotPasswordOutDto> => {
    const foundUser = await getUserDBRepository().findOne({
      where: { email },
    });
    if (foundUser) {
      await getForgotPasswordDBRepository().delete({ user: foundUser });
    }
    return await getForgotPasswordDBRepository().save({
      token: randomSHA256String(email),
      user: foundUser as UserOutDto,
    });
  },
  findForgotPasswordToken: async (token: string): Promise<ForgotPasswordOutDto | null> => {
    const foundToken = await getForgotPasswordDBRepository().findOne({
      where: { token },
      relations: { user: true },
    });
    return foundToken || null;
  },
};
