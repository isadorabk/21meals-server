'use strict';

module.exports = (sequelize, DataTypes) => {
  const Recipe_ingredient = sequelize.define('Recipe_ingredient', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    amount: {
      type: DataTypes.INTEGER
    }
  }, {
    underscored: true
  });

  return Recipe_ingredient;
};