import { Router } from 'express';
import { HTTP_STATUSES } from '../constants';
import { TypedRequestWithBody, TypedResponse } from '../router/types';
import { getValidateSchema } from '../schema-validator/schemas.utils';
import { AuthInDto } from '../auth/auth.dto';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { UserOutDto } from '../user/user.dto';
import { getValidAPIError } from '../errors.utils';
import { sha256String } from '../crypro.utils';

export const authRouter = Router();

authRouter.post(
  '/sign-in',
  getValidateSchema('/auth'),
  async (req: TypedRequestWithBody<AuthInDto>, res: TypedResponse<UserOutDto & { token: string }>) => {
    const foundUser = await userRepository.findUserForLogin(req.body);
    if (!foundUser) {
      return res.status(HTTP_STATUSES.NOT_FOUND_404).json(getValidAPIError({ field: '', message: 'User not found' }));
    }

    const token = jwt.sign(
      { login: req.body.login, password: sha256String(req.body.password) },
      process.env.JWT_SECRET as string,
    );

    res.status(HTTP_STATUSES.OK_200).json({ ...foundUser, token });
  },
);

authRouter.post(
  '/sign-up',
  getValidateSchema('/auth'),
  async (req: TypedRequestWithBody<AuthInDto>, res: TypedResponse<UserOutDto>) => {
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
