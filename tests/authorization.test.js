'use strict';

const mockData = require('./mocks/index').mockData;
const authMiddleware = require('../middlewares/authorization.js')(mockData.mockUser);
const authMiddlewareUserNotFound = require('../middlewares/authorization.js')(mockData.mockUserNotFound);
const next = jest.fn();
let ctx = {};

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => {
    return {
      id: 1
    };
  })
}));

describe('Authorization middleware', () => {
  beforeEach(() => ctx = {});

  test('should return a status 401 if the authentication strategy is not Bearer', async () => {
    ctx.headers = {
      authorization: 'Basic vnjsjpkvbjvbwv',
    };
    await authMiddleware(ctx, next);
    expect(ctx.status).toEqual(401);
    expect(ctx.body).toEqual({
      errors: ['Wrong authorization strategy.']
    });
  });

  test('should authenticate an authenticated user', async () => {
    ctx.headers = {
      authorization: 'Bearer dvdgfsag',
    };
    await authMiddleware(ctx, next);
    expect(ctx.user).toEqual({
      id: 'abc123',
      email: 'mario@mariobros.com',
      first_name: 'Mario',
      last_name: 'Bros'
    });
  });

  test('should return status 404 if the token is valid but there is no user', async () => {
    ctx.headers = {
      authorization: 'Bearer bsfpuihsdafuipsadbvj',
    };
    await authMiddlewareUserNotFound(ctx, next);
    expect(ctx.status).toEqual(404);
    expect(ctx.body).toEqual({
      errors: ['User does not exist.']
    });
  });

});
