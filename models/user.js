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
    auth_token: {
      type: DataTypes.STRING(1023),
      unique: true
    }, 
    hash_password: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    underscored: true
  });

  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      onDelete: 'CASCADE',
    });
    // User.hasMany(models.Plan);
  };

  return User;
};