'use strict';

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(511)
    },
    intructions: {
      allowNull: false,
      type: DataTypes.STRING(1023)
    },
    serves: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    photo: {
      type: DataTypes.STRING(511),
    }
  }, {
    underscored: true
  });

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      onDelete: 'CASCADE',
    });
  };

  return Recipe;
};