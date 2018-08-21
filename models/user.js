'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    first_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    last_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    hash_password: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    underscored: true
  });

  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
    User.hasMany(models.Plan, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
    User.hasMany(models.Shopping_list_item, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return User;
};