'use strict';

const router = require('koa-router')();
const authMiddleware = require('../middlewares/authorization.js');
const db = require('../models').db;
db.setup();
const PlansController = require('../controllers/plans.controller');
const plansController = new PlansController(db.Plan);
const MealsController = require('../controllers/meals.controller');
const mealsController = new MealsController(db.Plan_recipe);

// Plan routes
router
  .post('/', authMiddleware, plansController.createUsersPlan)
  .get('/', authMiddleware, plansController.getUsersPlans)
  .get('/:plan_id', authMiddleware, plansController.getUsersPlanById)
  .put('/:plan_id', authMiddleware, plansController.updateUsersPlanById)
  .delete('/:plan_id', authMiddleware, plansController.deleteUsersPlanById);

// Meal routes
router
  .put('/:plan_id/meal', authMiddleware, mealsController.updatePlansMealById);

module.exports = router;