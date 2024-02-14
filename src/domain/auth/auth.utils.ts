import { decodeAuthHeader } from '../../crypro.utils';
import { sessionRepository } from '../session/session.repository';

export const deleteSessionFromDBByToken = async (token?: string) => {
  const decodedToken = decodeAuthHeader(token);

  const foundSession = await sessionRepository.findSessionByHash(decodedToken?.sessionHash);
  if (foundSession) {
    await sessionRepository.deleteSessionByHash(foundSession?.sessionHash);
  }
  return null;
};
