import { UserOutDto } from '../user/user.dto';

export type SessionInDto = {
  user: UserOutDto;
  sessionHash: string;
};

export type SessionOutDto = {
  id: number;
  user: UserOutDto;
  sessionHash: string;
};
