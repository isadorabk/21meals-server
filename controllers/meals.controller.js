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

    const meal_id = ctx.request.body.mealId;
    const recipe_id = ctx.request.body.recipeId;
    
    // Update the plan_recipe with the specific id
    await this.Plan_recipe.update({recipe_id}, {
      where: {
        id: meal_id
      }
    });

    // Update shopping_list_item's

    // delete previous shopping list items for the user
    const user_id = ctx.user.id;
    await db.Shopping_list_item.destroy({
      where: {
        user_id
      }
    });

    // get all recipes ids from all meals in the plan
    const plan_id = ctx.params.plan_id;
    const recipes = await db.Plan_recipe.findAll({
      where: {
        plan_id
      },
      attributes: ['recipe_id']
    });

    //get ingredients with ingredient_id, amount and measure_id for each recipe from the mel
    const ingredients = [];
    await Promise.all(recipes.map(async (recipe) => {
      if (recipe.dataValues.recipe_id) {
        const recipeIngredientsData = await db.Recipe_ingredient.findAll({
          where: {
            recipe_id: recipe.dataValues.recipe_id
          },
          attributes: ['ingredient_id', 'measure_id', 'amount']
        });

        const recipeIngredients = recipeIngredientsData.map(el => el.dataValues);
        ingredients.push(...recipeIngredients);
      }
    }));

    // get total amount for each ingredient
    function sumRepeatedIngredients (acc, el) {
      const key = el.ingredient_id; // identify ingredient id
      const store = acc.store;
      const storedEl = store[key];
      if (storedEl) { // sum amounts of same ingredient's id
        storedEl.amount += el.amount;
      } else {
        store[key] = el;
        acc.result.push(el);
      }
      return acc;
    }
    const ingredientsWithTotalAmount = ingredients.reduce(sumRepeatedIngredients, {
      store: {},
      result: []
    }).result;

    // create the shopping list item for each ingredient and its total amount
    await Promise.all(ingredientsWithTotalAmount.map(async (ingredient) => {
      const total_amount = ingredient.amount ? ingredient.amount : 0;
      const shoppingListItem = {
        ...ingredient,
        user_id,
        total_amount
      };
      delete shoppingListItem.amount;
      await db.Shopping_list_item.create(shoppingListItem);
    }));

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
      attributes: ['id', 'weekday', 'meal_type', 'recipe_id', 'meal_order']
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