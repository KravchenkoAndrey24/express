import { requestTestApp } from './setupTests';

// TODO: update it
const userCredentials = {
  login: 'TestLogin',
};

export const signUpUser = async () => {
  await requestTestApp.post('/auth/sign-up').send(userCredentials);
};

export const getSignInToken = async () => {
  return (await requestTestApp.post('/auth/sign-in').send(userCredentials)).body.token;
};
