'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const RecipesController = require('../controllers/recipes.controller');
const recipesController = new RecipesController(db.Recipe);

// Recipe routes
router
  .post('/', authMiddleware, recipesController.createUsersRecipe)
  .get('/', authMiddleware, recipesController.getUsersRecipes)
  .get('/:recipe_id', authMiddleware, recipesController.getUsersRecipeById)
  .put('/:recipe_id', authMiddleware, recipesController.updateUsersRecipeById)
  .delete('/:recipe_id', authMiddleware, recipesController.deleteUsersRecipeById);

module.exports = router;