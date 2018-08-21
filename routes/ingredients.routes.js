'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const IngredientsController = require('../controllers/ingredients.controller');
const ingredientsController = new IngredientsController(db.Ingredient);

// Ingredient routes
router
  .post('/', authMiddleware, ingredientsController.createIngredient)
  .get('/', authMiddleware, ingredientsController.getIngredients);

module.exports = router;