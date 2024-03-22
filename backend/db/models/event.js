'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
      },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30]
      }
      },
    type: {
      type: DataTypes.STRING,
      allowNull: false
      },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 2
      }
      },
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        isPriceFormat(value) {
          let regex = /^\d+(\.\d{1,2})?$/;
          if(!regex.test(value)) {
            throw new Error('Invalid price format. Must be 00.00 format')
          }
        },
        notNegative(value) {
          if(!parseFloat(value) < 0) {
            throw new Error(`Price can't not be negative`)
          }
        }
      }
      },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 1000]
      }

    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isFuture(value) {
          if (new Date(value) <= new Date()) {
            throw new Error('Start date must be in the future');
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStart(value) {
          if (new Date(value) <= new Date(this.startDate)) {
            throw new Error('End date must be after start date');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
