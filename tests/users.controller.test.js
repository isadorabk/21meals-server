'use strict';

const mockData = require('./mocks/index').mockData;
const UsersController = require('../controllers/users.controller.js');
const usersController = new UsersController(mockData.mockUser);
const usersControllerNotFound = new UsersController(mockData.mockUserNotFound);

const next = jest.fn();
let ctx = {};

jest.mock('../models', () => ({
  db: {
    Plan: {...mockData.mockPlan},
    Plan_recipe: { ...mockData.mockPlanRecipe}
  }
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(() => true),
  hash: jest.fn()
}));

describe('Users controller', () => {
  beforeEach(() => ctx = {});

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
      ctx.user = {
        id: 'abc123',
        email: 'mario@mariobros.com',
        first_name: 'Mario',
        last_name: 'Bros'
      };
      await usersController.getUser(ctx, next);
      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(ctx.user);
    });
  });

  describe('createUser', () => {
    test('should throw an error if method not POST', async () => {
      try {
        ctx.method = 'GET';
        await usersController.createUser(ctx, next);
      } catch (e) {
        expect(e.message).toEqual('Method not allowed');
      }
    });

    test('should send status 406 if an email is not provide', async () => {
      ctx.method = 'POST';
      ctx.request = {
        body: { ...mockData.mockNewUser
        }
      };
      delete ctx.request.body.email;
      await usersController.createUser(ctx, next);
      expect(ctx.status).toBe(406);
      expect(ctx.body).toEqual({
        errors: ['Email and/or password needed']
      });
    });

    test('should send status 406 if a password is not provide', async () => {
      ctx.method = 'POST';
      ctx.request = {
        body: { ...mockData.mockNewUser
        }
      };
      delete ctx.request.body.password;
      await usersController.createUser(ctx, next);
      expect(ctx.status).toBe(406);
      expect(ctx.body).toEqual({
        errors: ['Email and/or password needed']
      });
    });

    test('should send status 403 if there is already an user with this email', async () => {
      ctx.method = 'POST';
      ctx.request = {
        body: { ...mockData.mockNewUser
        }
      };
      await usersController.createUser(ctx, next);
      expect(ctx.status).toBe(403);
      expect(ctx.body).toEqual({
        errors: ['User already exists.']
      });
    });

    test('should send status 201 if the user is created', async () => {
      ctx.method = 'POST';
      ctx.request = {
        body: { ...mockData.mockNewUser
        }
      };
      await usersControllerNotFound.createUser(ctx, next);
      expect(ctx.status).toBe(201);
      expect(ctx.body).toEqual(mockData.mockUserCreated);
    });
  });

  describe('signIn()', () => {
    test('should throw an error if method not GET', async () => {
      try {
        ctx.method = 'POST';
        await usersController.signIn(ctx, next);
      } catch (e) {
        expect(e.message).toEqual('Method not allowed');
      }
    });

    test('should return a status 401 if there is not a basic authentication', async () => {
      try {
        ctx.method = 'GET';
        ctx.headers = {
          authorization: 'Bearer',
        };
        await usersController.signIn(ctx, next);
      } catch (e) {
        expect(e.message).toEqual('Missing basic authentication header');
      }
    });

    test('should returns status 404 if there is no user with the id provided', async () => {
      ctx.method = 'GET';
      ctx.headers = {
        authorization: 'Basic oisdjaiosd',
      };
      await usersControllerNotFound.signIn(ctx, next);
      expect(ctx.status).toBe(404);
      expect(ctx.body).toEqual({
        errors: ['User does not exist.']
      });
    });

    test('should returns status 200 and the user', async () => {
      ctx.method = 'GET';
      ctx.headers = {
        authorization: 'Basic oisdjaiosd',
      };
      await usersController.signIn(ctx, next);
      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(mockData.mockUserCreated);
    });
  });
});
