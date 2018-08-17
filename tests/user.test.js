'use strict';

const UsersController = require('../controllers/users.controller.js');

const mockUser = {
  findOne: async () => {
    return {
      id: 123,
      name: 'Mario Bros'
    };
  }
};

const usersController = new UsersController(mockUser);

//TODO: This can be a spy waiting to be called.
const next = () => {};

describe('User controller', () => {
  describe('getUser()', () => {
    test('should throw if not GET', async () => {
      try {
        await usersController.getUser({}, next);
      } catch (e) {
        expect(e.message).toEqual('Method not allowed');
      }
    });

    test('should authenticate an authenticated user', async () => {
      const ctx = {
        headers: {
          authorization: 'Bearer 1234567890',
        },
        method: 'GET'
      };
      await usersController.getUser(ctx, next);
      expect(ctx.status).toEqual(200);
      expect(ctx.body).toEqual({
        id: 123,
        name: 'Mario Bros'
      });
    });
  });
});
