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
        {
          foreignKey: 'UserId'
        });
      Membership.belongsTo(models.Group,
        {
          foreignKey: 'groupId'
        })
    }
  }
  Membership.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Groups'}
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Users'}
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUppercase: true,
        status(value) {
          if(value.toUpperCase() !== 'PENDING' && value.toUpperCase() !== 'MEMBER' && value.toUpperCase() !== 'ADMIN') {
            throw new Error(`Status must be pending, member or admin.`)
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
