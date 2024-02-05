import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { UserOutDto } from './auth.dto';
import { HTTP_STATUSES } from '../constants';
import { getUserRepository } from '../repositories/auth.repository';

interface JWTPayload {
  login: string;
}

export type MiddlewareProtectedRouteType = (req: Request, res: Response, next: NextFunction) => void;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
};

export const getJWTpassport = (prisma: PrismaClient) => {
  const userRepository = getUserRepository(prisma);

  const JWTpassport = passport.use(
    new Strategy(jwtOptions, async (jwtPayload: JWTPayload, done: VerifiedCallback) => {
      const user = await userRepository.findUserByLogin(jwtPayload.login);
      if (user?.login) {
        done(null, user);
      } else {
        done(null, true);
      }
    }),
  );

  const protectedRoute: MiddlewareProtectedRouteType = (req: Request, res: Response, next: NextFunction): void => {
    JWTpassport.authenticate('jwt', { session: false }, (err: any, user: UserOutDto) => {
      if (err || !user) {
        return res.status(HTTP_STATUSES.NON_UNAUTHORIZED_401).json({ message: 'Unauthorized' });
      }

      req.user = user;
      return next();
    })(req, res, next);
  };

  return { JWTpassport, protectedRoute };
};
