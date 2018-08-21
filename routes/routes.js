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

const MealsController = require('../controllers/meals.controller');
const mealsController = new MealsController(db.Plan_recipe);

const ShoppingListItemsController = require('../controllers/shopping.list.items.controller');
const shoppingListItemsController = new ShoppingListItemsController(db.Shopping_list_item);


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
router.get('/ingredient-types', authMiddleware, ingredientTypesController.getIngredientTypes);

// Recipe routes
router
  .post('/recipes', authMiddleware, recipesController.createUsersRecipe)
  .get('/recipes', authMiddleware, recipesController.getUsersRecipes)
  .get('/recipes/:recipe_id', authMiddleware, recipesController.getUsersRecipeById)
  .put('/recipes/:recipe_id', authMiddleware, recipesController.updateUsersRecipeById)
  .delete('/recipes/:recipe_id', authMiddleware, recipesController.deleteUsersRecipeById);

// Plan routes
router
  .post('/plans', authMiddleware, plansController.createUsersPlan)
  .get('/plans', authMiddleware, plansController.getUsersPlans)
  .get('/plans/:plan_id', authMiddleware, plansController.getUsersPlanById)
  .put('/plans/:plan_id', authMiddleware, plansController.updateUsersPlanById)
  .delete('/plans/:plan_id', authMiddleware, plansController.deleteUsersPlanById);

// Meal routes
router
  .put('/plans/:plan_id/meal', authMiddleware, mealsController.updatePlansMealById);

// Shopping list routes
router
  .get('/shopping-list-items', authMiddleware, shoppingListItemsController.getUsersShoppingListItems)
  .put('/shopping-list-items', authMiddleware, shoppingListItemsController.updateUsersShoppingListItems);

module.exports = router;