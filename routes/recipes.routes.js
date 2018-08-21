'use strict';

const router = require('koa-router')();
const db = require('../models').db;
db.setup();
const RecipesController = require('../controllers/recipes.controller');
const recipesController = new RecipesController(db.Recipe);

// Recipe routes
router
  .post('/', recipesController.createUsersRecipe)
  .get('/', recipesController.getUsersRecipes)
  .get('/:recipe_id', recipesController.getUsersRecipeById)
  .put('/:recipe_id', recipesController.updateUsersRecipeById)
  .delete('/:recipe_id', recipesController.deleteUsersRecipeById);

module.exports = router;