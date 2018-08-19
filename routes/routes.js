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

const IngredientTypesController = require('../controllers/ingredient.types.controller');
const ingredientTypesController = new IngredientTypesController(db.Ingredient_type);

const RecipesController = require('../controllers/recipes.controller');
const recipesController = new RecipesController(db.Recipe);

const PlansController = require('../controllers/plans.controller');
const plansController = new PlansController(db.Plan);


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

// Ingredient_type routes
router.get('/ingredient-types', authMiddleware, ingredientTypesController.getIngredientTypes);

// Recipe routes
router
  .post('/recipes', authMiddleware, recipesController.createUsersRecipe)
  .get('/recipes', authMiddleware, recipesController.getUsersRecipes);

// Plan routes
router
  .post('/plans', authMiddleware, plansController.createUsersPlan)
  .get('/plans', authMiddleware, plansController.getUsersPlans)
  .get('/plans/:plan_id', authMiddleware, plansController.getUsersPlanById)
  .put('/plans/:plan_id', authMiddleware, plansController.updateUsersPlanById)
  .delete('/plans/:plan_id', authMiddleware, plansController.deleteUsersPlanById);

module.exports = router;