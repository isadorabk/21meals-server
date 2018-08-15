'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
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
      type: DataTypes.STRING,
      unique: true
    }, 
    hash_password: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  // User.associate = function (models) {
  //   models.db.User.hasMany(models.Recipe);
  //   models.db.User.hasMany(models.Plan);
  // };

  return User;
};