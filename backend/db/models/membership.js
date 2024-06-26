'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Membership.belongsTo(models.User,

        {foreignKey: 'userId'});


      Membership.belongsTo(models.Group,
        {foreignKey: 'groupId'});

    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {model: 'Users'}
    },
    groupId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {model: 'Groups'}
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLowercase: true,
        status(value) {
          if(value.toUpperCase() !== 'PENDING' && value.toUpperCase() !== 'MEMBER' && value.toUpperCase() !== 'CO-HOST' && value.toUpperCase() !== 'OWNER') {
            throw new Error(`Status must be pending, member or admin.`)
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ]
      }
    }
  });
  return Membership;
};
