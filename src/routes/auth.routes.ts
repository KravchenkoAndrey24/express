import { Router } from 'express';
import { HTTP_STATUSES } from '../constants';
import { TypedRequestWithBody, TypedResponse } from '../router/types';
import { getValidateSchema } from '../schema-validator/schemas.utils';
import { LoginInDto, LoginOutDto } from '../auth/auth.dto';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/auth.repository';
import { UserOutDto } from '../user/user.dto';
import { getValidAPIError } from '../errors.utils';

export const authRouter = Router();

authRouter.post(
  '/sign-in',
  getValidateSchema('/auth'),
  async (req: TypedRequestWithBody<LoginInDto>, res: TypedResponse<LoginOutDto>) => {
    const foundUser = await userRepository.findUserByLogin(req.body.login);
    const token = jwt.sign({ login: req.body.login }, 'secret');

    if (!foundUser) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUSES.OK_200).json({ ...foundUser, token });
  },
);

authRouter.post(
  '/sign-up',
  getValidateSchema('/auth'),
  async (req: TypedRequestWithBody<LoginInDto>, res: TypedResponse<UserOutDto>) => {
    try {
      const currentUser = await userRepository.createUser(req.body);
      res.status(HTTP_STATUSES.CREATED_201).json(currentUser);
    } catch {
      res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'login', message: 'User with this login already exists' }));
    }
  },
);
