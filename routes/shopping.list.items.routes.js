'use strict';

const router = require('koa-router')();
const db = require('../models').db;
db.setup();
const ShoppingListItemsController = require('../controllers/shopping.list.items.controller');
const shoppingListItemsController = new ShoppingListItemsController(db.Shopping_list_item);

// Shopping list routes
router
  .get('/', shoppingListItemsController.getUsersShoppingListItems)
  .put('/', shoppingListItemsController.updateUsersShoppingListItems);

module.exports = router;