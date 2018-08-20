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

const RecipesController = require('../controllers/recipes.controller');
const recipesController = new RecipesController(db.Recipe);

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

// Measure routes
router.get('/measures', authMiddleware, measuresController.getMeasures);

// Ingredient_type routes
router.get('/ingredient-type', authMiddleware, ingredientsTypeController.getIngredientsType);

// Recipe routes
router
  .post('/recipes', authMiddleware, recipesController.createUsersRecipe)
  .get('/recipes', authMiddleware, recipesController.getUsersRecipes)
  .get('/recipes/:recipe_id', authMiddleware, recipesController.getUsersRecipeById)
  .put('/recipes/:recipe_id', authMiddleware, recipesController.updateUsersRecipeById)
  .delete('/recipes/:recipe_id', authMiddleware, recipesController.deleteUsersRecipeById);

module.exports = router;