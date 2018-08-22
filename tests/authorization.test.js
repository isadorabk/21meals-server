'use strict';

const mockData = require('./mocks/index').mockData;
const mockUser = mockData.mockUser;
const authMiddleware = require('../middlewares/authorization.js')(mockUser);
const authMiddlewareUserNotFound = require('../middlewares/authorization.js')(mockData.mockUserNotFound);
const next = jest.fn();
let ctx = {};

describe('Authorization middleware', () => {
  beforeEach(() => ctx = {});

  test('should return a status 401 if the authentication strategy is not Bearer', async () => {
    ctx.headers = {
      authorization: 'Basic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYzEyMyIsImlhdCI6MTUzNDg2NjY0N30.mGPITCU_ylJfNZxpjOjoBpFp2kg55KtwFnUdl6oGFbc',
    };
    await authMiddleware(ctx, next);
    expect(ctx.status).toEqual(401);
    expect(ctx.body).toEqual({
      errors: ['Wrong authorization strategy.']
    });
  });

  test('should authenticate an authenticated user', async () => {
    ctx.headers = {
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYzEyMyIsImlhdCI6MTUzNDg2NjY0N30.mGPITCU_ylJfNZxpjOjoBpFp2kg55KtwFnUdl6oGFbc',
    };
    await authMiddleware(ctx, next);
    expect(ctx.user).toEqual(mockData.user);
  });

  test('should return status 404 if the token is valid but there is no user', async () => {
    ctx.headers = {
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYzEyMyIsImlhdCI6MTUzNDg2NjY0N30.mGPITCU_ylJfNZxpjOjoBpFp2kg55KtwFnUdl6oGFbc',
    };
    await authMiddlewareUserNotFound(ctx, next);
    expect(ctx.status).toEqual(404);
    expect(ctx.body).toEqual({
      errors: ['User does not exist.']
    });
  });

  test('should throw an error if token is invalid', async () => {
    try {
      ctx.headers = {
        authorization: 'Bearer eyJhbGcIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiyIsImlhdCI6MTUzNDg2NjY0N30.mGPITCU_ylJfNZxpjOjoBpFp2kg55KtwFnUdl6oGFbc',
      };
      await authMiddleware(ctx, next);
    } catch (e) {
      expect(e.message).toEqual('invalid token');
    }
  });
});
