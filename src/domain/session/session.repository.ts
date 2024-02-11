import { Session } from '../../entities/Session.entity';
import { SessionInDto, SessionOutDto } from './session.dto';
import AppDataSource from '../../typeOrm.config';
import { UserOutDto } from '../user/user.dto';

const sessionDBRepository = AppDataSource.getRepository(Session);

export const sessionRepository = {
  async createSession(data: SessionInDto): Promise<SessionOutDto> {
    return sessionDBRepository.save(data);
  },
  async deleteSessionByHash(hash: string): Promise<null> {
    await sessionDBRepository.delete({ sessionHash: hash });
    return null;
  },
  async deleteSessionByUser(user: UserOutDto): Promise<null> {
    await sessionDBRepository.delete({ user });
    return null;
  },
  async findSessionByHash(sessionHash?: string): Promise<SessionOutDto | null> {
    if (!sessionHash) {
      return null;
    }
    return (
      (await sessionDBRepository.findOne({
        where: { sessionHash },
        relations: { user: true },
      })) || null
    );
  },
};
