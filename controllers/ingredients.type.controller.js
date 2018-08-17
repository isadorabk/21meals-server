'use strict';

class IngredientsTypeController {
  constructor (ingredientTypeModel) {
    if (!ingredientTypeModel) throw new Error('Ingredient_type model not provided');
    this.Ingredient_type = ingredientTypeModel;
    this.getIngredientsType = this.getIngredientsType.bind(this);
  }

  async getIngredientsType (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find all ingredientsType
    const ingredientsType = await this.Ingredient_type.findAll({
      attributes: ['id', 'name'],
    });

    if (ingredientsType) {
      ctx.body = ingredientsType.map(el => {
        const res = {
          ...el.dataValues
        };
        return res;
      });
    } else {
      // Send an empty array if there's no ingredients type
      ctx.body = [];
    }
    ctx.status = 200;
  }

}

module.exports = IngredientsTypeController;