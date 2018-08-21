'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const UsersController = require('../controllers/users.controller');
const usersController = new UsersController(db.User);

// User routes
router
  .get('/', authMiddleware, usersController.getUser)
  .put('/', authMiddleware, usersController.updateUser)
  .delete('/', authMiddleware, usersController.deleteUser);

module.exports = router;