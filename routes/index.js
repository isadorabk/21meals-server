'use strict';

const router = require('koa-router')();

const plansRoutes = require('./plans.routes');
const recipesRoutes = require('./recipes.routes');
const ingredientsRoutes = require('./ingredients.routes');
const shoppingListItemsRoutes = require('./shopping.list.items.routes');
const usersRoutes = require('./users.routes');
const measuresRoutes = require('./measures.routes');
const ingredientTypesRoutes = require('./ingredient.types.routes');

const db = require('../models').db;
db.setup();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController(db.User);

router
  .post('/users', usersController.createUser)
  .get('/sign-in', usersController.signIn);

router
  .use('/me', usersRoutes.routes())
  .use('/measures', measuresRoutes.routes())
  .use('/ingredient-types', ingredientTypesRoutes.routes())
  .use('/ingredients', ingredientsRoutes.routes())
  .use('/recipes', recipesRoutes.routes())
  .use('/plans', plansRoutes.routes())
  .use('/shopping-list-items', shoppingListItemsRoutes.routes());
  

module.exports = router;