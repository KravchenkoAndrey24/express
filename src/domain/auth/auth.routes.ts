import { Router } from 'express';
import { HTTP_STATUSES } from '../../constants';
import { TypedRequestWithBody, TypedResponse } from '../../router/types';
import { getValidateSchema } from '../../schema-validator/schemas.utils';
import {
  AuthInDto,
  AuthTokensOutDto,
  ForgotPasswordStep1InDto,
  ForgotPasswordStep2InDto,
  SignInInDto,
  SignUpInDto,
} from './auth.dto';
import jwt from 'jsonwebtoken';
import { userRepository } from '../user/user.repository';
import { UserOutDto } from '../user/user.dto';
import { getValidAPIError } from '../../errors.utils';
import { generateRandomSHA256, sha256String } from '../../crypro.utils';
import { sessionRepository } from '../session/session.repository';
import { protectedRoute } from './auth.config';
import { deleteSessionFromDBByToken } from './auth.utils';
import { sendEmail } from '../../emails/utils';
import { hasPassedHours } from '../../date.utils';
import { temporaryUserTokenRepository } from '../temporary-user-token/temporaryUserToken.repository';
import { AUTH_OPTIONS } from './auth.const';

export const authRouter = Router();

authRouter.post(
  '/sign-in',
  getValidateSchema('sign-in'),
  async (req: TypedRequestWithBody<SignInInDto>, res: TypedResponse<UserOutDto & AuthTokensOutDto>) => {
    const foundUser = await userRepository.findUserForSignIn({
      email: req.body.email,
      password: sha256String(req.body.password),
    });
    if (!foundUser) {
      return res.status(HTTP_STATUSES.NOT_FOUND_404).json(getValidAPIError({ field: '', message: 'User not found' }));
    }
    await deleteSessionFromDBByToken(req?.headers?.authorization);

    const sessionHash = generateRandomSHA256();
    await sessionRepository.createSession({ user: foundUser, sessionHash });

    const accessToken = jwt.sign({ email: foundUser.email, sessionHash }, process.env.JWT_SECRET as string, {
      expiresIn: AUTH_OPTIONS.expiresIn.access,
    });
    const refreshToken = jwt.sign({ email: foundUser.email, sessionHash }, process.env.JWT_SECRET as string, {
      expiresIn: AUTH_OPTIONS.expiresIn.refresh,
    });

    res.status(HTTP_STATUSES.OK_200).json({ ...foundUser, accessToken, refreshToken });
  },
);

authRouter.post(
  '/sign-up',
  getValidateSchema('sign-in'),
  async (req: TypedRequestWithBody<SignUpInDto>, res: TypedResponse<UserOutDto>) => {
    try {
      const currentUser = await userRepository.createUser({ ...req.body, password: sha256String(req.body.password) });
      res.status(HTTP_STATUSES.CREATED_201).json(currentUser);
    } catch (e) {
      res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'email', message: 'User with this email already exists' }));
    }
  },
);

authRouter.post(
  '/sign-out',
  protectedRoute,
  async (req: TypedRequestWithBody<unknown>, res: TypedResponse<unknown>) => {
    try {
      deleteSessionFromDBByToken(req?.headers?.authorization);
      res.status(HTTP_STATUSES.NO_CONTENT_204).json();
    } catch (e) {
      res.status(HTTP_STATUSES.NO_CONTENT_204).json();
    }
  },
);

authRouter.post(
  '/forgot-password/step-1',
  getValidateSchema('forgot-password-step-1'),
  async (req: TypedRequestWithBody<ForgotPasswordStep1InDto>, res: TypedResponse<unknown>) => {
    const foundUser = await userRepository.findUserByEmail(req.body.email);

    if (!foundUser) {
      return res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .json(getValidAPIError({ field: 'user', message: 'User not found' }));
    }

    const { token } = await temporaryUserTokenRepository.createToken(foundUser.email);
    sendEmail({
      subject: 'Forgot password from learn-nodejs',
      text: `Secret key: ${token}`,
      to: foundUser.email,
      onSuccess: () => {
        res.status(HTTP_STATUSES.NO_CONTENT_204).json();
      },
      onError: () => {
        res
          .status(HTTP_STATUSES.BAD_REQUEST_400)
          .json(getValidAPIError({ field: 'email', message: 'Something went wrong' }));
      },
    });
  },
);

authRouter.post(
  '/forgot-password/step-2',
  getValidateSchema('forgot-password-step-2'),
  async (req: TypedRequestWithBody<ForgotPasswordStep2InDto>, res: TypedResponse<unknown>) => {
    const foundToken = await temporaryUserTokenRepository.findByToken(req.body.token);
    if (!foundToken) {
      return res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'token', message: 'Invalid token' }));
    }

    if (hasPassedHours(new Date(foundToken.createdAt), 24)) {
      return res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'token', message: 'Expired token' }));
    }

    const updatedUser = await userRepository.updatePassword({
      email: req.body.email,
      newPassword: sha256String(req.body.newPassword),
    });

    if (!updatedUser) {
      return res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'email', message: 'User not found' }));
    }

    res.status(HTTP_STATUSES.CREATED_201).json({ message: 'Password was updated' });
  },
);

authRouter.post(
  '/new-access-token',
  getValidateSchema('new-refresh-token'),
  async (req: TypedRequestWithBody<{ refreshToken: string }>, res: TypedResponse<AuthTokensOutDto>) => {
    try {
      const { refreshToken } = req.body;

      const isValidRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as AuthInDto;
      const foundUser = await userRepository.findUserByEmail(isValidRefreshToken.email);
      const foundSession = await sessionRepository.findSessionByHash(isValidRefreshToken.sessionHash);

      if (!foundUser || !foundSession) {
        const field = !foundUser ? 'user' : 'session';
        const message = !foundUser ? 'User not found' : 'Session not found';
        return res.status(HTTP_STATUSES.NOT_FOUND_404).json(getValidAPIError({ field, message }));
      }

      await sessionRepository.deleteSessionByUser(foundUser);

      const sessionHash = generateRandomSHA256();
      await sessionRepository.createSession({ user: foundUser, sessionHash });

      const accessToken = jwt.sign({ email: foundUser.email, sessionHash }, process.env.JWT_SECRET as string, {
        expiresIn: AUTH_OPTIONS.expiresIn.access,
      });
      const newRefreshToken = jwt.sign({ email: foundUser.email, sessionHash }, process.env.JWT_SECRET as string, {
        expiresIn: AUTH_OPTIONS.expiresIn.refresh,
      });
      res.status(HTTP_STATUSES.CREATED_201).json({ accessToken, refreshToken: newRefreshToken });
    } catch (e) {
      return res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: '', message: 'Invalid refresh token' }));
    }
  },
);
