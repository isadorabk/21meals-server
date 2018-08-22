'use strict';

const router = require('koa-router')();
const db = require('../models').db;
db.setup();
const PlansController = require('../controllers/plans.controller');
const plansController = new PlansController(db.Plan);
const MealsController = require('../controllers/meals.controller');
const mealsController = new MealsController(db.Plan_recipe);

// Plan routes
router
  .post('/', plansController.createUsersPlan)
  .get('/', plansController.getUsersPlans)
  .get('/:plan_id', plansController.getUsersPlanById)
  .put('/:plan_id', plansController.updateUsersPlanById)
  .delete('/:plan_id', plansController.deleteUsersPlanById);

// Meal routes
router
  .put('/:plan_id/meal', mealsController.updatePlansMealById);

module.exports = router;