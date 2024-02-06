import { AuthInDto } from '../auth/auth.dto';
import { sha256String } from '../crypro.utils';
import prisma from '../prisma.client';
import { UserInDto, UserOutDto } from '../user/user.dto';
import { userDBMapper } from '../user/user.mappers';

export const userRepository = {
  createUser: async (data: UserInDto): Promise<UserOutDto> => {
    return userDBMapper(await prisma.user.create({ data }));
  },
  findUserForLogin: async (data: AuthInDto): Promise<UserOutDto | null> => {
    const foundUser = await prisma.user.findUnique({
      where: { login: data.login, password: sha256String(data.password) },
    });
    if (!foundUser) {
      return null;
    }
    return userDBMapper(foundUser);
  },
};
