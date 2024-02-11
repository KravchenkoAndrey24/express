import { UserOutDto } from '../user/user.dto';

export type TemporaryUserTokenOutDto = {
  user: UserOutDto;
  token: string;
  createdAt: Date;
};
