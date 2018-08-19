'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');

const db = require('../models').db;
db.setup();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController(db.User);

const IngredientsController = require('../controllers/ingredients.controller');
const ingredientsController = new IngredientsController(db.Ingredient);

// User routes
router
  .post('/users', usersController.createUser)
  .get('/sign-in', usersController.signIn)
  .get('/me', authMiddleware, usersController.getUser)
  .put('/me', authMiddleware, usersController.updateUser)
  .delete('/me', authMiddleware, usersController.deleteUser);

// Ingredient routes
router
  .post('/ingredients', authMiddleware, ingredientsController.createIngredient)
  .get('/ingredients', authMiddleware, ingredientsController.getIngredients);

module.exports = router;