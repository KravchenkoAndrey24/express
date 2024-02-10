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
  findAll: async () => {
    return getSessionDBRepository().find();
  },
  findSessionByHash: async (sessionHash?: string): Promise<SessionOutDto | null> => {
    if (!sessionHash) {
      return null;
    }
    return (
      (await getSessionDBRepository().findOne({
        where: { sessionHash },
        relations: { user: true },
      })) || null
    );
  },
};
