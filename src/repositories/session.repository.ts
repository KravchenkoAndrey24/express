import { Session } from '../entities/Session.entity';
import { SessionInDto, SessionOutDto } from '../session/session.dto';
import AppDataSource from '../typeOrm.config';

const getSessionDBRepository = () => AppDataSource.getRepository(Session);

export const sessionRepository = {
  createSession: async (data: SessionInDto): Promise<SessionOutDto> => {
    return getSessionDBRepository().save(data);
  },
  deleteSessionByHash: async (hash: string): Promise<null> => {
    await getSessionDBRepository().delete({ sessionHash: hash });
    return null;
  },
  findSessionByHash: async (sessionHash?: string): Promise<SessionOutDto | null> => {
    const foundSession = await getSessionDBRepository().findOne({
      where: { sessionHash },
    });
    if (!foundSession) {
      return null;
    }
    return foundSession;
  },
};
