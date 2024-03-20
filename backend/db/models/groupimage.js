'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupImage.belongsTo(models.Group,
        {foreignKey: 'groupId'})
    }
  }
  GroupImage.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      validate: {
        validExtension(value) {
          const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            if(!value.includes(validImageExtensions)) {
              throw new Error(`File must be an extension of .jpg, .jpeg, .png or .gif `)
            }
        }
      }
      },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};
