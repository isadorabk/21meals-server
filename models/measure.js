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
    },
    short: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true
  });

  Measure.associate = (models) => {
    Measure.hasMany(models.Recipe_ingredient, {
      onDelete: 'CASCADE'
    });
    Measure.hasMany(models.Shopping_list_item, {
      onDelete: 'CASCADE'
    });
  };

  return Measure;
};