'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    underscored: true
  });

  Ingredient.associate = (models) => {
    Ingredient.belongsTo(models.Ingredient_type, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
    Ingredient.belongsToMany(models.Recipe, {
      through: 'Recipe_ingredient',
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
        name: 'ingredient_id'
      }
    });
    Ingredient.hasOne(models.Shopping_list_item, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Ingredient;
};