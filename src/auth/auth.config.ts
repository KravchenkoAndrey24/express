import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../constants';
import { userRepository } from '../repositories/auth.repository';
import { UserOutDto } from '../user/user.dto';
import { MiddlewareRouteType } from '../router/types';
import { AuthInDto } from './auth.dto';
import { getValidAPIError } from '../errors.utils';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

export const JWTpassport = passport.use(
  new Strategy(jwtOptions, async (jwtPayload: AuthInDto, done: VerifiedCallback) => {
    const user = await userRepository.findUserForLogin(jwtPayload);
    if (user?.login) {
      done(null, user);
    } else {
      done(null, true);
    }
  }),
);

export const protectedRoute: MiddlewareRouteType = (req: Request, res: Response, next: NextFunction): void => {
  JWTpassport.authenticate('jwt', { session: false }, (err: any, user: UserOutDto) => {
    if (err || !user) {
      return res
        .status(HTTP_STATUSES.NON_UNAUTHORIZED_401)
        .json(getValidAPIError({ field: '', message: 'Unauthorized' }));
    }

    req.user = user;
    return next();
  })(req, res, next);
};
