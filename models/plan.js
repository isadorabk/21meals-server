'use strict';

module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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

  Plan.associate = (models) => {
    Plan.belongsTo(models.User, {
      onDelete: 'CASCADE',
      allowNull: false
    });
    Plan.belongsToMany(models.Recipe, {
      through: 'Plan_recipe',
      onDelete: 'CASCADE',
      allowNull: false
    });
  };

  return Plan;
};