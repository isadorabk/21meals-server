'use strict';

const router = require('koa-router')();
const db = require('../models').db;
db.setup();
const IngredientsController = require('../controllers/ingredients.controller');
const ingredientsController = new IngredientsController(db.Ingredient);

// Ingredient routes
router
  .post('/', ingredientsController.createIngredient)
  .get('/', ingredientsController.getIngredients);

module.exports = router;