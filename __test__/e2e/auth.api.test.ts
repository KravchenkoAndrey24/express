import { requestTestApp } from '../setupTests';
import { userRepository } from '../../src/domain/user/user.repository';
import { sessionRepository } from '../../src/domain/session/session.repository';
import jwt from 'jsonwebtoken';
import { getTestValidErrorMessage, mockedSession, mockedTemporaryUserToken, mockedUser } from '../utils';
import { HTTP_STATUSES } from '../../src/constants';
import { temporaryUserTokenRepository } from '../../src/domain/temporary-user-token/temporaryUserToken.repository';
import * as authUtils from '../../src/domain/auth/auth.utils';
import * as cryptoUtils from '../../src/crypro.utils';
import { AUTH_OPTIONS } from '../../src/domain/auth/auth.const';
import passport from 'passport';

const mockVerify = (bool?: boolean) => {
  jest.spyOn(jwt, 'verify').mockImplementation(() => {
    if (bool) {
      return true;
    }
    throw Error('Invalid refresh token');
  });
};

jest.spyOn(jwt, 'sign').mockImplementation(() => {
  return 'mockToken';
});

describe('POST /auth/new-access-token', () => {
  it('should respond with 404 if user not found', async () => {
    mockVerify(true);
    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce(null);

    const res = await requestTestApp.post('/auth/new-access-token').send({ refreshToken: 'valid_refresh_token' });

    expect(res.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    expect(getTestValidErrorMessage(res)).toBe('User not found');
  });

  it('should respond with 404 if session not found', async () => {
    mockVerify(true);
    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce(mockedUser);
    jest.spyOn(sessionRepository, 'findSessionByHash').mockResolvedValueOnce(null);

    const res = await requestTestApp.post('/auth/new-access-token').send({ refreshToken: 'valid_refresh_token' });

    expect(res.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    expect(getTestValidErrorMessage(res)).toBe('Session not found');
  });

  it('should respond with 201 and new tokens if user and session found', async () => {
    mockVerify(true);
    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce(mockedUser);
    jest.spyOn(sessionRepository, 'findSessionByHash').mockResolvedValueOnce(mockedSession);
    jest.spyOn(sessionRepository, 'deleteSessionByUser').mockResolvedValueOnce(null);
    jest.spyOn(sessionRepository, 'createSession').mockResolvedValueOnce(mockedSession);

    const response = await requestTestApp.post('/auth/new-access-token').send({ refreshToken: 'valid_refresh_token' });

    expect(response.status).toBe(HTTP_STATUSES.CREATED_201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should respond with 400 if refresh token is invalid', async () => {
    mockVerify(false);

    const res = await requestTestApp.post('/auth/new-access-token').send({ refreshToken: 'invalid_refresh_token' });

    expect(res.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(getTestValidErrorMessage(res)).toBe('Invalid refresh token');
  });
});

describe('POST /auth/forgot-password/step-2', () => {
  it('should respond with 400 if token is invalid', async () => {
    jest.spyOn(temporaryUserTokenRepository, 'findByToken').mockResolvedValueOnce(null);

    const res = await requestTestApp
      .post('/auth/forgot-password/step-2')
      .send({ token: 'invalid_token', email: 'test@example.com', newPassword: 'new_password' });

    expect(res.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(getTestValidErrorMessage(res)).toBe('Invalid token');
  });

  it('should respond with 400 if token is expired', async () => {
    jest
      .spyOn(temporaryUserTokenRepository, 'findByToken')
      .mockResolvedValueOnce({ ...mockedTemporaryUserToken, createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) });

    const res = await requestTestApp
      .post('/auth/forgot-password/step-2')
      .send({ token: 'expired_token', email: 'test@example.com', newPassword: 'new_password' });

    expect(res.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(getTestValidErrorMessage(res)).toBe('Expired token');
  });

  it('should respond with 400 if user not found', async () => {
    jest
      .spyOn(temporaryUserTokenRepository, 'findByToken')
      .mockResolvedValueOnce({ ...mockedTemporaryUserToken, createdAt: new Date() });
    jest.spyOn(userRepository, 'updatePassword').mockResolvedValueOnce(null);

    const res = await requestTestApp
      .post('/auth/forgot-password/step-2')
      .send({ token: 'valid_token', email: 'test@example.com', newPassword: 'new_password' });

    expect(res.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(getTestValidErrorMessage(res)).toBe('User not found');
  });

  it('should respond with 201 if password was updated', async () => {
    jest
      .spyOn(temporaryUserTokenRepository, 'findByToken')
      .mockResolvedValueOnce({ ...mockedTemporaryUserToken, createdAt: new Date() });
    jest.spyOn(userRepository, 'updatePassword').mockResolvedValueOnce({ ...mockedUser, email: 'test@example.com' });

    const res = await requestTestApp
      .post('/auth/forgot-password/step-2')
      .send({ token: 'valid_token', email: 'test@example.com', newPassword: 'new_password' });

    expect(res.status).toBe(HTTP_STATUSES.CREATED_201);
    expect(res.body.message).toBe('Password was updated');
  });
});

describe('POST /auth/forgot-password/step-1', () => {
  // TODO: need to mock nodemailer
  it('should return 400 if user is not found', async () => {
    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce(null);

    const res = await requestTestApp.post('/auth/forgot-password/step-1').send({ email: 'nonexistent@example.com' });

    expect(res.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
    expect(getTestValidErrorMessage(res)).toBe('User not found');
  });
});

describe('POST /auth/sign-up', () => {
  it('should create a new user', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    userRepository.createUser = jest.fn().mockResolvedValueOnce(mockUser);

    const res = await requestTestApp.post('/auth/sign-up').send(mockUser).expect(201);

    expect(res.status).toBe(HTTP_STATUSES.CREATED_201);
    expect(res.body).toEqual(mockUser);
    expect(userRepository.createUser).toHaveBeenCalledWith({
      ...mockUser,
      password: expect.any(String), // Assuming sha256String is properly tested elsewhere
    });
  });

  it('should return 400 if user already exists', async () => {
    const mockUser = {
      email: 'existing@example.com',
      password: 'password123',
    };

    userRepository.createUser = jest.fn().mockImplementationOnce(() => {
      throw new Error('User with this email already exists');
    });

    const res = await requestTestApp.post('/auth/sign-up').send(mockUser);

    expect(res.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(getTestValidErrorMessage(res)).toBe('User with this email already exists');
    expect(userRepository.createUser).toHaveBeenCalledWith({
      ...mockUser,
      password: expect.any(String), // Assuming sha256String is properly tested elsewhere
    });
  });
});

describe('POST /auth/sign-in', () => {
  it('should sign in user and return tokens', async () => {
    jest.spyOn(sessionRepository, 'createSession').mockResolvedValue(mockedSession);
    jest.spyOn(cryptoUtils, 'sha256String').mockReturnValue('mockHashedPassword');
    jest.spyOn(cryptoUtils, 'generateRandomSHA256').mockReturnValue('mockSessionHash');

    userRepository.findUserForSignIn = jest.fn().mockResolvedValue(mockedUser);

    const res = await requestTestApp
      .post('/auth/sign-in')
      .send({ email: mockedUser.email, password: 'mockHashedPassword' });

    expect(res.status).toBe(HTTP_STATUSES.OK_200);
    expect(userRepository.findUserForSignIn).toHaveBeenCalledWith({
      email: mockedUser.email,
      password: 'mockHashedPassword',
    });

    expect(sessionRepository.createSession).toHaveBeenCalledWith({
      user: mockedUser,
      sessionHash: 'mockSessionHash',
    });

    expect(jwt.sign).toHaveBeenCalledWith(
      { email: mockedUser.email, sessionHash: 'mockSessionHash' },
      expect.any(String),
      { expiresIn: AUTH_OPTIONS.expiresIn.access },
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      { email: mockedUser.email, sessionHash: 'mockSessionHash' },
      expect.any(String),
      { expiresIn: AUTH_OPTIONS.expiresIn.refresh },
    );

    expect(res.body).toEqual({
      ...mockedUser,
      createdAt: mockedUser.createdAt.toISOString(),
      updatedAt: mockedUser.updatedAt.toISOString(),
      accessToken: 'mockToken',
      refreshToken: 'mockToken',
    });
  });

  it('should return 404 if user not found', async () => {
    const mockUser = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    userRepository.findUserForSignIn = jest.fn().mockResolvedValueOnce(null);

    const res = await requestTestApp.post('/auth/sign-in').send(mockUser).expect(404);

    expect(userRepository.findUserForSignIn).toHaveBeenCalledWith({
      email: mockUser.email,
      password: 'mockHashedPassword',
    });

    expect(getTestValidErrorMessage(res)).toBe('User not found');
  });
});

describe('POST /auth/sign-out', () => {
  it('should successfully sign out and return 204 status code', async () => {
    jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
      callback && callback(null, mockedUser);
    });

    jest.spyOn(authUtils, 'deleteSessionFromDBByToken').mockResolvedValue(null);
    const res = await requestTestApp.post('/auth/sign-out').send();

    expect(res.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
    expect(res.body).toEqual({});
  });
});

describe('deleteSessionFromDBByToken function', () => {
  beforeAll(() => {
    jest.spyOn(authUtils, 'deleteSessionFromDBByToken').mockRestore();
  });
  beforeEach(() => {
    jest.spyOn(sessionRepository, 'deleteSessionByHash').mockClear();
    jest.spyOn(sessionRepository, 'findSessionByHash').mockClear();
    jest.spyOn(cryptoUtils, 'decodeAuthHeader').mockClear();
  });

  it('should delete session if found', async () => {
    jest.spyOn(cryptoUtils, 'decodeAuthHeader').mockReturnValueOnce({ sessionHash: 'randomHash' });
    jest
      .spyOn(sessionRepository, 'findSessionByHash')
      .mockResolvedValueOnce({ sessionHash: 'randomHash', id: 1, user: mockedUser });
    jest.spyOn(sessionRepository, 'deleteSessionByHash').mockResolvedValueOnce(null);

    await authUtils.deleteSessionFromDBByToken('randomToken');

    expect(sessionRepository.findSessionByHash).toHaveBeenCalledWith('randomHash');
    expect(sessionRepository.deleteSessionByHash).toHaveBeenCalledWith('randomHash');
  });

  it('should not delete session if not found', async () => {
    jest.spyOn(cryptoUtils, 'decodeAuthHeader').mockReturnValueOnce(null);
    jest.spyOn(sessionRepository, 'findSessionByHash').mockResolvedValueOnce(null);
    jest.spyOn(sessionRepository, 'deleteSessionByHash').mockResolvedValueOnce(null);

    await authUtils.deleteSessionFromDBByToken('randomToken');

    expect(sessionRepository.findSessionByHash).toHaveBeenCalledWith(undefined);
    expect(sessionRepository.deleteSessionByHash).not.toHaveBeenCalled();
  });

  it('should throw an error if sessionRepository.findSessionByHash throws an error', async () => {
    jest.spyOn(sessionRepository, 'findSessionByHash').mockRejectedValueOnce(new Error('Database error'));

    await expect(authUtils.deleteSessionFromDBByToken('randomToken')).rejects.toThrow('Database error');
  });
});
