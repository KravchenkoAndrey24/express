import prisma from '../prisma.client';
import { UserInDto, UserOutDto } from '../user/user.dto';

export const userRepository = {
  createUser: async (data: UserInDto): Promise<UserOutDto> => {
    return prisma.user.create({ data });
  },
  findUserByLogin: async (login: string): Promise<UserOutDto | null> => {
    return prisma.user.findUnique({ where: { login } });
  },
};
