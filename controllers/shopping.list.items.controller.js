'use strict';

const filterProps = require('../services/utils.js').filterProps;
const db = require('../models').db;

class ShoppingListItemsController {
  constructor (shoppingListItemModel) {
    if (!shoppingListItemModel) throw new Error('Shopping_list_item model not provided');
    this.ShoppingListItem = shoppingListItemModel;
    this.getUsersShoppingListItems = this.getUsersShoppingListItems.bind(this);
    this.updateUsersShoppingListItems = this.updateUsersShoppingListItems.bind(this);
  }

  async getUsersShoppingListItems (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    const user_id = ctx.user.id;

    const items = await this.ShoppingListItem.findAll({
      where: {
        user_id,
      },
      attributes: ['id', 'bought', 'total_amount'],
      include: [{
        model: db.Measure,
        attributes: ['name']
      }, {
        model: db.Ingredient,
        attributes: ['name'],
        include: [{
          model: db.Ingredient_type,
          attributes: ['name']
        }]
      }]
    });
    
    const shoppingListItems = items.map(el => {
      const measure = el.dataValues.Measure ? el.dataValues.Measure.dataValues.name : null;
      const result = {
        ...el.dataValues,
        measure,
        ingredient: el.dataValues.Ingredient.dataValues.name,
        ingredient_type: el.dataValues.Ingredient.dataValues.Ingredient_type.dataValues.name
      };
      delete result.Measure;
      delete result.Ingredient;
      return result;
    });
    ctx.body = shoppingListItems;
    ctx.status = 200;
  }

  async updateUsersShoppingListItems (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'PUT') throw new Error('Method not allowed');

    const item_id = ctx.request.body.itemId;
    const user_id = ctx.user.id;

    // update bought property of the shopping list item
    const item = await this.ShoppingListItem.findOne({
      where: {
        id: item_id
      }
    });
    await item.update({
      bought: !item.dataValues.bought
    });

    // get all shopping list items

    const items = await this.ShoppingListItem.findAll({
      where: {
        user_id,
      },
      attributes: ['id', 'bought', 'total_amount'],
      include: [{
        model: db.Measure,
        attributes: ['name']
      }, {
        model: db.Ingredient,
        attributes: ['name'],
        include: [{
          model: db.Ingredient_type,
          attributes: ['name']
        }]
      }]
    });

    const shoppingListItems = items.map(el => {
      const measure = el.dataValues.Measure ? el.dataValues.Measure.dataValues.name : null;
      const result = {
        ...el.dataValues,
        measure,
        ingredient: el.dataValues.Ingredient.dataValues.name,
        ingredient_type: el.dataValues.Ingredient.dataValues.Ingredient_type.dataValues.name
      };
      delete result.Measure;
      delete result.Ingredient;
      return result;
    });
    ctx.body = shoppingListItems;
    ctx.status = 200;
  }
}

module.exports = ShoppingListItemsController;