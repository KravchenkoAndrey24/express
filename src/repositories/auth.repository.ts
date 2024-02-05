import { PrismaClient } from '@prisma/client';
import { UserInDto, UserOutDto } from '../auth/auth.dto';

export const getUserRepository = (prisma: PrismaClient) => ({
  createUser: async (data: UserInDto): Promise<UserOutDto> => {
    return await prisma.user.create({ data });
  },
  findUserByLogin: async (login: string): Promise<UserOutDto | null> => {
    return (await prisma.user.findUnique({ where: { login } })) ?? null;
  },
});
