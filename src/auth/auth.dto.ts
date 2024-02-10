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
