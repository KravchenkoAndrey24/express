import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest, VerifiedCallback } from 'passport-jwt';
import { NextFunction, Request, Response } from 'express';
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

export const protectedRoute: MiddlewareRouteType = (req: Request, res: Response, next: NextFunction): void => {
  JWTpassport.authenticate('jwt', { session: false }, async (err: any, user: UserOutDto) => {
    if (err || !user) {
      await deleteSessionFromDBByToken(req?.headers?.authorization);
      return res
        .status(HTTP_STATUSES.NON_UNAUTHORIZED_401)
        .json(getValidAPIError({ field: '', message: 'Unauthorized' }));
    }

    req.user = user;
    return next();
  })(req, res, next);
};
