'use strict';

const filterProps = require('../services/utils.js').filterProps;
const db = require('../models').db;

class PlansController {
  constructor (planModel) {
    if (!planModel) throw new Error('Plan model not provided');
    this.Plan = planModel;
    this.createUsersPlan = this.createUsersPlan.bind(this);

  }

  async createUsersPlan (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'POST') throw new Error('Method not allowed');

    const data = ctx.request.body;
    //Check if the request has a name
    if (data.name) {
      data.name = data.name.toLowerCase();
      // Check if there's already a plan with this name
      let plan = await this.Plan.findOne({
        where: {
          name: data.name
        }
      });
      // if there's already a plan, send an error
      if (plan) {
        ctx.status = 401;
        ctx.body = {
          errors: ['Plan already exists.']
        };
      } else {
        // If there's no plan with this name, create a new one
        plan = filterProps(data, ['name']);
        plan.user_id = ctx.user.id;
        const newPlan = await this.Plan.create(plan);

        // Create plan_recipe for each meal
        const meals = data.meals;
        await Promise.all(meals.map(async (meal) => {
          const planRecipe = {
            ...meal,
            plan_id: newPlan.id,
          };
          const newPlanRecipe = await db.Plan_recipe.create(planRecipe);
        }));

        let res = filterProps(newPlan.dataValues, ['id', 'name', 'user_id']);
        res = {
          ...res,
          meals
        };
        ctx.body = res;
        ctx.status = 201;
      }
    } else {
      ctx.status = 406;
      ctx.body = {
        errors: ['Name of the plan needed']
      };
      return;
    }
  }

}

module.exports = PlansController;