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
    });
    Ingredient.belongsToMany(models.Recipe, {
      through: 'Recipe_ingredient',
      onDelete: 'CASCADE',
      allowNull: false,
    });
  };

  return Ingredient;
};