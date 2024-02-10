import { UserOutDto } from '../user/user.dto';

export type AuthInDto = {
  email: string;
  sessionHash: string;
};

export type SignUpInDto = {
  email: string;
  password: string;
};

export type SignInInDto = {
  email: string;
  password: string;
};

export type ForgotPasswordStep1InDto = {
  email: string;
};

export type ForgotPasswordStep2InDto = {
  email: string;
  newPassword: string;
  token: string;
};

export type ForgotPasswordOutDto = {
  user: UserOutDto;
  token: string;
};
