'use strict';

module.exports = (sequelize, DataTypes) => {
  const Plan_recipe = sequelize.define('Plan_recipe', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    weekday: {
      allowNull: false,
      type: DataTypes.STRING
    },
    meal_type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    meal_order: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    underscored: true
  });

  return Plan_recipe;
};