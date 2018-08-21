'use strict';

const mockData = require('./mocks/index').mockData;
const mockUser = mockData.mockUser;
const UsersController = require('../controllers/users.controller.js');
const usersController = new UsersController(mockUser);
const authMiddleware = require('../middlewares/authorization.js')(mockUser);
const next = jest.fn();
const ctx = {};

describe('Authorization middleware', () => {
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
    console.log(ctx);
    
    // expect(ctx.status).toEqual(200);
    // expect(ctx.body).toEqual({
    //   id: 123,
    //   name: 'Mario Bros'
    // });
  });
});
