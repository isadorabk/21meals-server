'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const UsersController = require('../controllers/users.controller');
const usersController = new UsersController(db.User);

// User routes
router
  .get('/', usersController.getUser)
  .put('/', usersController.updateUser)
  .delete('/', usersController.deleteUser);

module.exports = router;