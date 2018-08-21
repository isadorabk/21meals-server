'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const ShoppingListItemsController = require('../controllers/shopping.list.items.controller');
const shoppingListItemsController = new ShoppingListItemsController(db.Shopping_list_item);

// Shopping list routes
router
  .get('/', authMiddleware, shoppingListItemsController.getUsersShoppingListItems)
  .put('/', authMiddleware, shoppingListItemsController.updateUsersShoppingListItems);

module.exports = router;