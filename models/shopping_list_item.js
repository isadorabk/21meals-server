'use strict';

module.exports = (sequelize, DataTypes) => {
  const Shopping_list_item = sequelize.define('Shopping_list_item', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bought: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    underscored: true
  });

  Shopping_list_item.associate = (models) => {
    Shopping_list_item.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
    Shopping_list_item.belongsTo(models.Ingredient, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
    Shopping_list_item.belongsTo(models.Measure, {
      onDelete: 'CASCADE'
    });
  };

  return Shopping_list_item;
};