export type LoginInDto = {
  login: string;
};

export type LoginOutDto = {
  login: string;
  token: string;
};

export type UserInDto = {
  login: string;
};

export type UserOutDto = {
  id: number;
  login: string;
};
