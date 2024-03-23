'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.belongsTo(models.Event, {
        foreignKey: 'venueId',
        
      });

      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Venue.init({
    groupId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        is: /^[a-zA-Z0-9\s\.,#-]+$/i,
      }
    },
    city: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    state: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2,2],
        isAlpha: true,
        isUppercase: true
      }
    },
    latitude: {
      type:DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
        min: -90, // Minimum latitude value
        max: 90, // Maximum latitude value
      }
    },
    longitude: {
      type:DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
        min: -180, // Minimum longitude value
        max: 180, // Maximum longitude value
      }
    },
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
