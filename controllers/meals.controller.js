'use strict';

const filterProps = require('../services/utils.js').filterProps;
const db = require('../models').db;

class MealsController {
  constructor (planRecipeModel) {
    if (!planRecipeModel) throw new Error('Plan_recipe model not provided');
    this.Plan_recipe = planRecipeModel;
    this.updatePlansMealById = this.updatePlansMealById.bind(this);
  }

  async updatePlansMealById (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'PUT') throw new Error('Method not allowed');

    const data = ctx.request.body;
    
    // Update the plan_recipe with the specific id
    let plan_recipe = filterProps(data, ['recipe_id']);
    await this.Plan_recipe.update(plan_recipe, {
      where: {
        id: data.meal_id
      }
    });
    const plan_id = ctx.params.plan_id;

    // Get updated plan with meals
    const updatedPlan = await db.Plan.findOne({
      where: {
        id: plan_id
      },
      attributes: ['id', 'name']
    });
    const updatedMeals = await this.Plan_recipe.findAll({
      where: {
        plan_id: updatedPlan.id
      },
      attributes: ['id', 'weekday', 'meal_type', 'recipe_id']
    });

    // Put the updatedMeals inside the plan
    const updatedPlanWithMeals = {
      ...updatedPlan.dataValues,
      meals: updatedMeals
    };

    ctx.body = updatedPlanWithMeals;
    ctx.status = 200;
  } 
}

module.exports = MealsController;