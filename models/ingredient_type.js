'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ingredient_type = sequelize.define('Ingredient_type', {
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

  Ingredient_type.associate = (models) => {
    Ingredient_type.hasMany(models.Ingredient, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Ingredient_type;
};