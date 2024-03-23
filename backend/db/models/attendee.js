'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendee.belongsTo(models.User,
        {
          foreignKey: 'userId'
        });
      Attendee.belongsTo(models.Event,
        {
          foreignKey: 'eventId'
        });
    }
  }
  Attendee.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Users'}
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Events'}
    },
    status:{
    type:DataTypes.STRING,
    allowNull: false,
    validate: {
      status(value) {

        if(!value.toLowerCase() === 'attending' && value.toLowerCase() !== 'not going') {
          throw new Error('Status can only bet set Attending or not going.')
        }
      }
    }
  }
  }, {
    sequelize,
    modelName: 'Attendee',
  });
  return Attendee;
};
