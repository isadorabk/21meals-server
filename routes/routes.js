'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');

const db = require('../models').db;
db.setup();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController(db.User);

// User routes
router
  .post('/users', usersController.createUser)
  .get('/sign-in', usersController.signIn)
  .get('/me', authMiddleware, usersController.getUser);

module.exports = router;