'use strict';



const { Model, Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Group,
        {
          foreignKey: 'organizerId' ,
          onDelete: 'CASCADE',
          hooks: true
        }
          );

      User.belongsToMany(models.Group,
        {
          through: models.Membership,
          foreignKey: 'userId',
          otherKey: 'groupId',

        });

      User.belongsToMany(models.Event,
        {
          through: models.Attendee,
          foreignKey: 'userId',
          otherKey: 'eventId',
        });


    }
  }
  User.init({
    firstName: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['firstName', 'lastName', 'hashedPassword', 'email', 'createdAt', 'updatedAt' ]
      }
    }
  });
  return User;
};
