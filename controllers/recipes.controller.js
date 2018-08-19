'use strict';

const filterProps = require('../services/utils.js').filterProps;
const db = require('../models').db;

class RecipesController {
  constructor (recipeModel) {
    if (!recipeModel) throw new Error('Recipe model not provided');
    this.Recipe = recipeModel;
    this.createUsersRecipe = this.createUsersRecipe.bind(this);
    this.getUsersRecipes = this.getUsersRecipes.bind(this);
    this.getUsersRecipeById = this.getUsersRecipeById.bind(this);
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
        ctx.body = [res];
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

  async getUsersRecipes (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find all recipes
    const recipes = await this.Recipe.findAll({
      attributes: ['id', 'title', 'instructions', 'serves', 'photo']
    });

    if (recipes) {
      let res = [];
      
      // Find list of ingredients for each recipe
      await Promise.all(recipes.map(async (recipe) => {
        const ingredients = await db.Recipe_ingredient.findAll({
          where: {
            recipe_id: recipe.id
          },
          attributes: ['id', 'ingredient_id', 'measure_id', 'amount'],
          include: [{
            model: db.Measure,
            attributes: ['name', 'short']
          }]
        });

        // Get the name of the measures for each ingredient
        const ingredientsWithMeasure = ingredients.map(el => {
          const measure = el.dataValues.measure_id ? el.dataValues.Measure.dataValues.name : null;
          const short_measure = el.dataValues.measure_id ? el.dataValues.Measure.dataValues.short : null;
          const result = {
            ...el.dataValues,
            measure,
            short_measure
          };
          delete result.Measure;
          delete result.measure_id;
          return result;
        });

        // Put the ingredients inside the recipes
        const recipeWithIngredients = {
          ...recipe.dataValues,
          ingredients: ingredientsWithMeasure
        };
        res.push(recipeWithIngredients);
      }));

      ctx.body = res;
    } else {
      // Send an empty array if there's no recipe
      ctx.body = [];
    }
    ctx.status = 200;
  }

  async getUsersRecipeById (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find the recipe by the id parameter
    const recipe_id = ctx.params.recipe_id;
    const recipe = await this.Recipe.findOne({
      where: {
        id: recipe_id
      },
      attributes: ['id', 'title', 'instructions', 'serves', 'photo']
    });

    if (recipe) {
      // Find all ingredients for this recipe
      const ingredients = await db.Recipe_ingredient.findAll({
        where: {
          recipe_id
        },
        attributes: ['id', 'ingredient_id', 'measure_id', 'amount'],
        include: [{
          model: db.Measure,
          attributes: ['name', 'short']
        }]
      });

      // Get the name of the measures for each ingredient
      const ingredientsWithMeasure = ingredients.map(el => {
        const measure = el.dataValues.measure_id ? el.dataValues.Measure.dataValues.name : null;
        const short_measure = el.dataValues.measure_id ? el.dataValues.Measure.dataValues.short : null;
        
        const result = {
          ...el.dataValues,
          measure,
          short_measure
        };
        delete result.Measure;
        delete result.measure_id;
        return result;
        
        
      });

      // Put the ingredients inside the recipes
      const recipeWithIngredients = {
        ...recipe.dataValues,
        ingredients: ingredientsWithMeasure
      };

      ctx.body = [recipeWithIngredients];
      ctx.status = 200;

    } else {
      // Send an error if there's no recipe with this id
      ctx.status = 404;
      ctx.body = {
        errors: ['Recipe not found.']
      };
      return;
    }


  }
}

module.exports = RecipesController;