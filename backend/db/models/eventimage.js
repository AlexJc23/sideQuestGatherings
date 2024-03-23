'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event,
        {foreignKey: 'eventId'})
    }
  }
  EventImage.init({
    eventId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      validExtension(value) {
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
          if(!value.includes(validImageExtensions)) {
            throw new Error(`File must be an extension of .jpg, .jpeg, .png or .gif `)
          }
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
