'use strict';

const filterProps = require('../services/utils.js').filterProps;
const db = require('../models').db;

class RecipesController {
  constructor (recipeModel) {
    if (!recipeModel) throw new Error('Recipe model not provided');
    this.Recipe = recipeModel;
    this.createUsersRecipe = this.createUsersRecipe.bind(this);
  }

  async createUsersRecipe (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'POST') throw new Error('Method not allowed');

    const data = ctx.request.body;
    //Check if the request has a title
    if (data.title) {
      data.title = data.title.toLowerCase();
      // Check if there's already a recipe with this title
      let recipe = await this.Recipe.findOne({
        where: {
          title: data.title
        }
      });
      // if there's already a recipe, send an error
      if (recipe) {
        ctx.status = 401;
        ctx.body = {
          errors: ['Recipe already exists.']
        };
      } else {
        // If there's no recipe with this name, create a new one
        recipe = filterProps(data, ['title', 'instructions', 'serves', 'photo']);
        recipe.user_id = ctx.user.id;
        const newRecipe = await this.Recipe.create(recipe);

        // Create recipe_ingredient for each ingredient
        const ingredients = data.ingredients;
        await Promise.all(ingredients.map(async (ingredient) => {
          const recipeIngredient = {
            ...ingredient,
            recipe_id: newRecipe.id
          };
          await db.Recipe_ingredient.create(recipeIngredient);
        }));

        let res = filterProps(newRecipe.dataValues, ['id', 'title', 'instructions', 'serves', 'photo', 'user_id']);
        res = {
          ...res,
          ingredients
        };
        ctx.body = res;
        ctx.status = 201;
      }
    } else {
      ctx.status = 406;
      ctx.body = {
        errors: ['Name of the recipe needed']
      };
      return;
    }
  }
}

module.exports = RecipesController;