export type UserInDto = {
  email: string;
  password: string;
};

export type UserOutDto = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
