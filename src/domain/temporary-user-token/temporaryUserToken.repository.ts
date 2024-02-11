import { randomSHA256String } from '../../crypro.utils';
import { TemporaryUserToken } from '../../entities';
import AppDataSource from '../../typeOrm.config';
import { UserOutDto } from '../user/user.dto';
import { userRepository } from '../user/user.repository';
import { TemporaryUserTokenOutDto } from './temporaryUserToken.dto';

const temporaryUserTokenDBRepository = AppDataSource.getRepository(TemporaryUserToken);

export const temporaryUserTokenRepository = {
  async createToken(email: string): Promise<TemporaryUserTokenOutDto> {
    const foundUser = await userRepository.findUserByEmail(email);
    if (foundUser) {
      await temporaryUserTokenRepository.deleteTokensForUser(foundUser);
    }
    return await temporaryUserTokenDBRepository.save({
      token: randomSHA256String(email),
      user: foundUser as UserOutDto,
    });
  },
  async findByToken(token: string): Promise<TemporaryUserTokenOutDto | null> {
    const foundToken = await temporaryUserTokenDBRepository.findOne({
      where: { token },
      relations: { user: true },
    });
    return foundToken || null;
  },
  async deleteTokensForUser(user: UserOutDto) {
    await temporaryUserTokenDBRepository.delete({ user });
    return null;
  },
};
