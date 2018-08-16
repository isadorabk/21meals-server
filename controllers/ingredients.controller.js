'use strict';

const db = require('../models').db;
const filterProps = require('../services/utils.js').filterProps;


class IngredientsController {
  constructor (ingredientModel) {
    if (!ingredientModel) throw new Error('Ingredient model not provided');
    this.Ingredient = ingredientModel;
    this.createIngredient = this.createIngredient.bind(this);
    this.getIngredients = this.getIngredients.bind(this);
  }

  async createIngredient (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'POST') throw new Error('Method not allowed');

    const data = ctx.request.body;
    //Check if the request has email and password
    if (data.name) {
      data.name = data.name.toLowerCase();
      // Check if there's already an ingredient with this name
      let ingredient = await this.Ingredient.findOne({
        where: {
          name: data.name
        }
      });
      // if there's already a ingredient, send an error
      if (ingredient) {
        ctx.status = 401;
        ctx.body = {
          errors: ['Ingredient already exists.']
        };
      } else {
        // If there's no ingredient, create a new one
        ingredient = filterProps(data, ['name', 'ingredient_type_id']);
        let newIngredient = await this.Ingredient.create(ingredient);

        ctx.body = filterProps(newIngredient.dataValues, ['id', 'name']);
        ctx.status = 201;
      }
    } else {
      ctx.status = 406;
      ctx.body = {
        errors: ['Name of ingredient needed']
      };
      return;
    }
  }

  async getIngredients (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find all ingredients
    const ingredients = await this.Ingredient.findAll({
      include: [{
        model: db.Ingredient_type
      }]
    });

    if (ingredients) {
      ctx.body = ingredients.map(el => {
        return {
          id: el.id,
          name: el.name,
          ingredient_type: el.dataValues.Ingredient_type.dataValues.name
        };
      });
      ctx.status = 200;
    } else {
      // Send an error if there's no ingredient
      ctx.status = 404;
      ctx.body = {
        errors: ['No ingredient was found.']
      };
      return;
    }
  }
}

module.exports = IngredientsController;