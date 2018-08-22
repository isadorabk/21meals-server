'use strict';

const router = require('koa-router')();

const plansRoutes = require('./plans.routes');
const recipesRoutes = require('./recipes.routes');
const ingredientsRoutes = require('./ingredients.routes');
const shoppingListItemsRoutes = require('./shopping.list.items.routes');
const usersRoutes = require('./users.routes');
const measuresRoutes = require('./measures.routes');
const ingredientTypesRoutes = require('./ingredient.types.routes');
const authMiddleware = require('../middlewares/authorization.js');

const db = require('../models').db;
db.setup();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController(db.User);

router
  .post('/users', usersController.createUser)
  .get('/sign-in', usersController.signIn);

router
  .use('/me', authMiddleware(db.User), usersRoutes.routes())
  .use('/measures', authMiddleware(db.User), measuresRoutes.routes())
  .use('/ingredient-types', authMiddleware(db.User), ingredientTypesRoutes.routes())
  .use('/ingredients', authMiddleware(db.User), ingredientsRoutes.routes())
  .use('/recipes', authMiddleware(db.User), recipesRoutes.routes())
  .use('/plans', authMiddleware(db.User), plansRoutes.routes())
  .use('/shopping-list-items', authMiddleware(db.User), shoppingListItemsRoutes.routes());
  

module.exports = router;