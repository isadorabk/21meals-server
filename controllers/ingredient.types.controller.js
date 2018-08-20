'use strict';

class IngredientTypesController {
  constructor (ingredientTypeModel) {
    if (!ingredientTypeModel) throw new Error('Ingredient_type model not provided');
    this.Ingredient_type = ingredientTypeModel;
    this.getIngredientTypes = this.getIngredientTypes.bind(this);
  }

  async getIngredientTypes (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find all ingredient types
    const ingredientTypes = await this.Ingredient_type.findAll({
      attributes: ['id', 'name'],
    });

    if (ingredientTypes) {
      ctx.body = ingredientTypes.map(el => el.dataValues);
    } else {
      // Send an empty array if there's no ingredient type
      ctx.body = [];
    }
    ctx.status = 200;
  }

}

module.exports = IngredientTypesController;