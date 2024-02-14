import { UserOutDto } from '../user/user.dto';

export type TemporaryUserTokenOutDto = {
  id: number;
  user: UserOutDto;
  token: string;
  createdAt: Date;
};
