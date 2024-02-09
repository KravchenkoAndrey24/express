import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest, VerifiedCallback } from 'passport-jwt';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../constants';
import { userRepository } from '../repositories/user.repository';
import { UserOutDto } from '../user/user.dto';
import { MiddlewareRouteType } from '../router/types';
import { AuthInDto } from './auth.dto';
import { getValidAPIError } from '../errors.utils';
import { sessionRepository } from '../repositories/session.repository';
import { decodeAuthHeader } from '../crypro.utils';

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

export const JWTpassport = passport.use(
  new Strategy(jwtOptions, async (jwtPayload: AuthInDto, done: VerifiedCallback) => {
    const user = await userRepository.findUserByLogin(jwtPayload.login);
    const foundSession = await sessionRepository.findSessionByHash(jwtPayload.sessionHash);

    if (user && foundSession) {
      done(null, user);
    } else {
      done(null, false);
    }
  }),
);

export const protectedRoute: MiddlewareRouteType = (req: Request, res: Response, next: NextFunction): void => {
  JWTpassport.authenticate('jwt', { session: false }, async (err: any, user: UserOutDto) => {
    if (err || !user) {
      const decodedToken = decodeAuthHeader(req?.headers?.authorization);
      const foundSession = await sessionRepository.findSessionByHash(decodedToken?.sessionHash);
      if (foundSession) {
        await sessionRepository.deleteSessionByHash(foundSession?.sessionHash);
      }

      return res
        .status(HTTP_STATUSES.NON_UNAUTHORIZED_401)
        .json(getValidAPIError({ field: '', message: 'Unauthorized' }));
    }

    req.user = user;
    return next();
  })(req, res, next);
};
