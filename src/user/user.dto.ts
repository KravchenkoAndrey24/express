export type UserInDto = {
  login: string;
  password: string;
};

export type UserOutDto = {
  id: number;
  login: string;
  createdAt: Date;
  updatedAt: Date;
};
