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
    //Check if the request has name
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
        const newIngredient = await this.Ingredient.create(ingredient);
        const res = filterProps(newIngredient.dataValues, ['id', 'name']);

        // Find name of the ingredient type
        const ingredient_type = await db.Ingredient_type.findOne({
          where: {
            id: data.ingredient_type_id
          }
        });
        res.ingredient_type = ingredient_type.dataValues.name;

        ctx.body = [res];
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
      attributes: ['id', 'name'],
      include: [{
        model: db.Ingredient_type,
        attributes: ['name']
      }]
    });

    if (ingredients) {
      ctx.body = ingredients.map(el => {
        const res = {
          ...el.dataValues,
          ingredient_type: el.dataValues.Ingredient_type.dataValues.name
        };
        delete res.Ingredient_type;
        return res;
      });
    } else {
      // Send an empty array if there's no ingredient
      ctx.body = [];
    }
    ctx.status = 200;
  }
}

module.exports = IngredientsController;