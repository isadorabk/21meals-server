'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const IngredientTypesController = require('../controllers/ingredient.types.controller');
const ingredientTypesController = new IngredientTypesController(db.Ingredient_type);

// Ingredient_type routes
router.get('/', authMiddleware, ingredientTypesController.getIngredientTypes);

module.exports = router;