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
    this.updateUsersRecipeById = this.updateUsersRecipeById.bind(this);
    this.deleteUsersRecipeById = this.deleteUsersRecipeById.bind(this);
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
        ctx.status = 403;
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
            recipe_id: newRecipe.dataValues.id
          };
          await db.Recipe_ingredient.create(recipeIngredient);
        }));

        // Find all ingredients for this recipe
        const newIngredients = await db.Recipe_ingredient.findAll({
          where: {
            recipe_id: newRecipe.dataValues.id
          },
          attributes: ['id', 'ingredient_id', 'measure_id', 'amount'],
          include: [{
            model: db.Measure,
            attributes: ['name', 'short']
          }]
        });

        // Get the name of the measures for each ingredient
        const newIngredientsWithMeasure = newIngredients.map(el => {
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

        // Put the ingredients inside the recipe
        let res = filterProps(newRecipe.dataValues, ['id', 'title', 'instructions', 'serves', 'photo']);
        const newRecipeWithIngredients = {
          ...res,
          ingredients: newIngredientsWithMeasure
        };

        ctx.body = [newRecipeWithIngredients];
        ctx.status = 201;
      }
    } else {
      ctx.status = 406;
      ctx.body = {
        errors: ['Title of the recipe needed']
      };
      return;
    }
  }

  async getUsersRecipes (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find all recipes from the user
    const user_id = ctx.user.id;
    const recipes = await this.Recipe.findAll({
      where: {
        user_id
      },
      attributes: ['id', 'title', 'instructions', 'serves', 'photo']
    });

    if (recipes) {
      const res = [];
      
      // Find list of ingredients for each recipe
      await Promise.all(recipes.map(async (recipe) => {
        const ingredients = await db.Recipe_ingredient.findAll({
          where: {
            recipe_id: recipe.dataValues.id
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

  async updateUsersRecipeById (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'PUT') throw new Error('Method not allowed');

    const data = ctx.request.body;
    data.title = data.title.toLowerCase();

    // Update the recipe with the specific id
    let recipe = filterProps(data, ['title', 'instructions', 'serves', 'photo']);
    const recipe_id = ctx.params.recipe_id;
    recipe.user_id = ctx.user.id;
    await this.Recipe.update(recipe, {
      where: {
        id: recipe_id
      }
    });

    // Update recipe_ingredient for each ingredient
    const ingredients = data.ingredients;
    await Promise.all(ingredients.map(async (ingredient) => {
      const recipeIngredient = {
        ...ingredient,
        recipe_id
      };
      await db.Recipe_ingredient.update({
        amount: ingredient.amount,
        measure_id: ingredient.measure_id
      }, {
        where: {
          recipe_id,
          ingredient_id: ingredient.ingredient_id
        }
      });
    }));

    // Get updated recipe with ingredients
    const updatedRecipe = await this.Recipe.findOne({
      where: {
        id: recipe_id
      },
      attributes: ['id', 'title', 'instructions', 'serves', 'photo']
    });

    const updatedIngredients = await db.Recipe_ingredient.findAll({
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
    const updatedIngredientsWithMeasure = updatedIngredients.map(el => {
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
    const updatedRecipeWithIngredients = {
      ...updatedRecipe.dataValues,
      ingredients: updatedIngredientsWithMeasure
    };

    ctx.body = [updatedRecipeWithIngredients];
    ctx.status = 200;

  }

  async deleteUsersRecipeById (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'DELETE') throw new Error('Method not allowed');

    // Delete the recipe with the specific id
    const recipe_id = ctx.params.recipe_id;

    await this.Recipe.destroy({
      where: {
        id: recipe_id
      }
    });

    // Check if the recipe was deleted correctly
    const recipe = await this.Recipe.findOne({
      where: {
        id: recipe_id
      },
      attributes: ['id']
    });

    if (!recipe) ctx.status = 200;
    else {
      ctx.status = 501;
      ctx.body = {
        errors: ['An error ocurred. Recipe not deleted']
      };
      return;
    }
  }
}

module.exports = RecipesController;