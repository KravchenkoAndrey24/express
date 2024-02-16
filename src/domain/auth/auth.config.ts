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
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { generateRandomSHA256 } from '../../crypro.utils';

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.CLIENT_URL}/auth/oauth2/success`,
      scope: ['profile', 'email'],
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      const currentEmail = (profile?.emails && profile?.emails[0] && profile.emails[0]?.value) || null;
      if (!currentEmail) {
        done(null, false);
        return;
      }
      const user = await userRepository.findUserByEmail(currentEmail);

      if (!user) {
        try {
          const newUser = await userRepository.createUser({
            email: currentEmail,
            password: generateRandomSHA256(),
          });
          done(null, newUser);
        } catch {
          done(null, false);
        }
      } else {
        done(null, user);
      }
    },
  ),
);

passport.use(
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
  passport.authenticate('jwt', { session: false }, (err: any, user: UserOutDto) => {
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

export const googleAuthRoute: MiddlewareRouteType = (req, res, next): void => {
  passport.authenticate('google', { session: false }, (err: any, user: UserOutDto) => {
    if (err) {
      return res
        .status(HTTP_STATUSES.SERVER_ERROR_500)
        .json(getValidAPIError({ field: '', message: 'An error occurred during authentication' }));
    }

    if (!user) {
      return res
        .status(HTTP_STATUSES.NON_UNAUTHORIZED_401)
        .json(getValidAPIError({ field: '', message: 'Unauthorized' }));
    }

    req.user = user;
    next();
  })(req, res, next);
};
