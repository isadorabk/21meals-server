'use strict';

module.exports = (sequelize, DataTypes) => {
  const Measure = sequelize.define('Measure', {
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

  Measure.associate = (models) => {
    Measure.belongsToMany(models.Recipe, {
      through: 'Recipe_ingredient',
      onDelete: 'CASCADE'
    });
  };

  return Measure;
};