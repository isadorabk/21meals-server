'use strict';

const mockData = require('./mocks/index').mockData;
const mockUser = mockData.mockUser;
const UsersController = require('../controllers/users.controller.js');
const usersController = new UsersController(mockUser);

const next = jest.fn();
const ctx = {};

describe('User controller', () => {
  describe('getUser()', () => {
    test('should throw an error if method not GET', async () => {
      try {
        ctx.method = 'POST';
        await usersController.getUser(ctx, next);
      } catch (e) {
        expect(e.message).toEqual('Method not allowed');
      }
    });

    test('should returns status 404 if no user is passed in ctx', async () => {
      ctx.method = 'GET';
      await usersController.getUser(ctx, next);
      expect(ctx.status).toBe(404);
      expect(ctx.body).toEqual({errors: ['User does not exist.']});
    });

    test('should returns status 200 and the user', async () => {
      ctx.method = 'GET';
      ctx.user = mockData.user;
      await usersController.getUser(ctx, next);
      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(ctx.user);
    });
  });
});
