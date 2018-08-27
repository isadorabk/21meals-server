'use strict';

const filterProps = require('../services/utils.js').filterProps;
const db = require('../models').db;

class PlansController {
  constructor (planModel) {
    if (!planModel) throw new Error('Plan model not provided');
    this.Plan = planModel;
    this.createUsersPlan = this.createUsersPlan.bind(this);
    this.getUsersPlans = this.getUsersPlans.bind(this);
    this.getUsersPlanById = this.getUsersPlanById.bind(this);
    this.updateUsersPlanById = this.updateUsersPlanById.bind(this);
    this.deleteUsersPlanById = this.deleteUsersPlanById.bind(this);
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
          await db.Plan_recipe.create(planRecipe);
        }));

        const newMeals = await db.Plan_recipe.findAll({
          where: {
            plan_id: newPlan.id
          },
          attributes: ['id', 'weekday', 'meal_type', 'recipe_id', 'meal_order']
        });

        let res = filterProps(newPlan.dataValues, ['id', 'name', 'user_id']);
        res = {
          ...res,
          meals: newMeals
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

  async getUsersPlans (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find all plans from the user
    const user_id = ctx.user.id;
    const plans = await this.Plan.findAll({
      where: {
        user_id
      },
      attributes: ['id', 'name']
    });

    if (plans) {
      const res = [];

      // Find list of meals for each plan
      await Promise.all(plans.map(async (plan) => {
        let meals = await db.Plan_recipe.findAll({
          where: {
            plan_id: plan.dataValues.id
          },
          attributes: ['id', 'weekday', 'meal_type', 'recipe_id', 'meal_order']
        });

        // Put the meals inside the plans
        meals = meals.map(el => el.dataValues);
        const planWithMeals = {
          ...plan.dataValues,
          meals
        };
        res.push(planWithMeals);
      }));

      ctx.body = res;
    } else {
      // Send an empty array if there's no plan
      ctx.body = [];
    }
    ctx.status = 200;
  }

  async getUsersPlanById (ctx, next) {

    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find the plan by the id parameter
    const plan_id = ctx.params.plan_id;
    const plan = await this.Plan.findOne({
      where: {
        id: plan_id
      },
      attributes: ['id', 'name']
    });

    if (plan) {
      // Find all meals for this plan
      let meals = await db.Plan_recipe.findAll({
        where: {
          plan_id: plan.dataValues.id
        },
        attributes: ['id', 'weekday', 'meal_type', 'recipe_id', 'meal_order']
      });

      // Put the meals inside the plan
      meals = meals.map(el => el.dataValues);
      const planWithMeals = {
        ...plan.dataValues,
        meals
      };

      ctx.body = planWithMeals;
      ctx.status = 200;
    } else {
      // Send an error if there's no plan with this id
      ctx.status = 404;
      ctx.body = {
        errors: ['Plan not found.']
      };
      return;
    }
  }

  async updateUsersPlanById (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'PUT') throw new Error('Method not allowed');

    const data = ctx.request.body;
    data.name = data.name.toLowerCase();
    
    // Update the plan with the specific id
    const plan = filterProps(data, ['name']);
    const plan_id = ctx.params.plan_id;
    plan.user_id = ctx.user.id;
    await this.Plan.update(plan, {
      where: {
        id: plan_id
      }
    });
    
    // Update plan_recipe for each meal
    const meals = data.meals;
    await Promise.all(meals.map(async (meal) => {
      await db.Plan_recipe.update({
        recipe_id: meal.recipe_id
      }, {
        where: {
          plan_id,
          weekday: meal.weekday,
          meal_type: meal.meal_type
        }
      });
    }));

    // Get updated plan with meals
    const updatedPlan = await this.Plan.findOne({
      where: {
        id: plan_id
      },
      attributes: ['id', 'name']
    });

    let updatedMeals = await db.Plan_recipe.findAll({
      where: {
        plan_id: updatedPlan.dataValues.id
      },
      attributes: ['id', 'weekday', 'meal_type', 'recipe_id', 'meal_order']
    });

    // Put the updatedMeals inside the plan
    updatedMeals = meals.map(el => el.dataValues);
    const updatedPlanWithMeals = {
      ...updatedPlan.dataValues,
      meals: updatedMeals
    };

    ctx.body = updatedPlanWithMeals;
    ctx.status = 200;
  }

  async deleteUsersPlanById (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'DELETE') throw new Error('Method not allowed');
    
    // Delete the plan with the specific id
    const plan_id = ctx.params.plan_id;
    
    await this.Plan.destroy({
      where: {
        id: plan_id
      }
    });

    const plan = await this.Plan.findOne({
      where: {
        id: plan_id
      },
      attributes: ['id', 'name']
    });

    if (!plan) ctx.status = 200;
    else {
      ctx.status = 501;
      ctx.body = {
        errors: ['An error ocurred. Plan not deleted']
      };
      return;
    }
  }

}

module.exports = PlansController;