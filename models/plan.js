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
      type: DataTypes.STRING
    }
  }, {
    underscored: true
  });

  Plan.associate = (models) => {
    Plan.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
    Plan.belongsToMany(models.Recipe, {
      through: {
        model: 'Plan_recipe',
        unique: false
      },
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
        name: 'plan_id'
      }
    });
  };

  return Plan;
};