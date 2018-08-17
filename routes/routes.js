'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');

const db = require('../models').db;
db.setup();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController(db.User);

const IngredientsController = require('../controllers/ingredients.controller');
const ingredientsController = new IngredientsController(db.Ingredient);

const MeasuresController = require('../controllers/measures.controller');
const measuresController = new MeasuresController(db.Measure);

// User routes
router
  .post('/users', usersController.createUser)
  .get('/sign-in', usersController.signIn)
  .get('/me', authMiddleware, usersController.getUser);

// Ingredient routes
router
  .post('/ingredients', authMiddleware, ingredientsController.createIngredient)
  .get('/ingredients', authMiddleware, ingredientsController.getIngredients);

// Measure routes
router.get('/measures', authMiddleware, measuresController.getMeasures);

module.exports = router;