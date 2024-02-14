import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest, VerifiedCallback } from 'passport-jwt';
import { HTTP_STATUSES } from '../../constants';
import { userRepository } from '../user/user.repository';
import { UserOutDto } from '../user/user.dto';
import { MiddlewareRouteType } from '../../router/types';
import { AuthInDto } from './auth.dto';
import { getValidAPIError } from '../../errors.utils';
import { sessionRepository } from '../session/session.repository';
import { deleteSessionFromDBByToken } from './auth.utils';

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

export const JWTpassport = passport.use(
  new Strategy(jwtOptions, async (jwtPayload: AuthInDto, done: VerifiedCallback) => {
    const user = await userRepository.findUserByEmail(jwtPayload.email);
    const foundSession = await sessionRepository.findSessionByHash(jwtPayload.sessionHash);

    if (user && foundSession) {
      done(null, user);
    } else {
      done(null, false);
    }
  }),
);

export const protectedRoute: MiddlewareRouteType = (req, res, next): void => {
  JWTpassport.authenticate('jwt', { session: false }, (err: any, user: UserOutDto) => {
    if (err) {
      return res
        .status(HTTP_STATUSES.SERVER_ERROR_500)
        .json(getValidAPIError({ field: '', message: 'An error occurred during authentication' }));
    }
    if (!user) {
      const token = req?.headers?.authorization?.split(' ')[1];
      if (token) {
        deleteSessionFromDBByToken(token).catch((err) => {
          console.error('Error deleting session from DB', err);
        });
      }
      return res
        .status(HTTP_STATUSES.NON_UNAUTHORIZED_401)
        .json(getValidAPIError({ field: '', message: 'Unauthorized' }));
    }
    req.user = user;
    next();
  })(req, res, next);
};
