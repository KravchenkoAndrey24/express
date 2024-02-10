import { SignInInDto } from '../src/auth/auth.dto';
import { requestTestApp } from './setupTests';

const userCredentials: SignInInDto = {
  email: 'TestEmail',
  password: 'TestPassword',
};

export const signUpUser = async () => {
  await requestTestApp.post('/auth/sign-up').send(userCredentials);
};

export const getSignInToken = async () => {
  return (await requestTestApp.post('/auth/sign-in').send(userCredentials)).body.token;
};
