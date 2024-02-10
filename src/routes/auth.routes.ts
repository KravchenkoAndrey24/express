import { Router } from 'express';
import { HTTP_STATUSES } from '../constants';
import { TypedRequestWithBody, TypedResponse } from '../router/types';
import { getValidateSchema } from '../schema-validator/schemas.utils';
import { SignInInDto, SignUpInDto } from '../auth/auth.dto';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { UserOutDto } from '../user/user.dto';
import { getValidAPIError } from '../errors.utils';
import { generateRandomSHA256, sha256String } from '../crypro.utils';
import { sessionRepository } from '../repositories/session.repository';
import { protectedRoute } from '../auth/auth.config';
import { deleteSessionFromDBByToken } from '../auth/auth.utils';

export const authRouter = Router();

authRouter.post(
  '/sign-in',
  getValidateSchema('/auth'),
  async (req: TypedRequestWithBody<SignInInDto>, res: TypedResponse<UserOutDto & { token: string }>) => {
    const foundUser = await userRepository.findUserForLogin(req.body);
    if (!foundUser) {
      return res.status(HTTP_STATUSES.NOT_FOUND_404).json(getValidAPIError({ field: '', message: 'User not found' }));
    }
    await deleteSessionFromDBByToken(req?.headers?.authorization);

    const sessionHash = generateRandomSHA256();
    await sessionRepository.createSession({ user: foundUser, sessionHash });

    const token = jwt.sign({ login: foundUser.login, sessionHash }, process.env.JWT_SECRET as string);
    res.status(HTTP_STATUSES.OK_200).json({ ...foundUser, token });
  },
);

authRouter.post(
  '/sign-up',
  getValidateSchema('/auth'),
  async (req: TypedRequestWithBody<SignUpInDto>, res: TypedResponse<UserOutDto>) => {
    try {
      const currentUser = await userRepository.createUser({ ...req.body, password: sha256String(req.body.password) });
      res.status(HTTP_STATUSES.CREATED_201).json(currentUser);
    } catch (e) {
      res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'login', message: 'User with this login already exists' }));
    }
  },
);

authRouter.post(
  '/sign-out',
  protectedRoute,
  async (req: TypedRequestWithBody<unknown>, res: TypedResponse<unknown>) => {
    try {
      await deleteSessionFromDBByToken(req?.headers?.authorization);
      res.status(HTTP_STATUSES.NO_CONTENT_204).json();
    } catch (e) {
      res.status(HTTP_STATUSES.NO_CONTENT_204).json();
    }
  },
);
