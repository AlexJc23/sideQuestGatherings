'use strict';
const { GroupImage, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'GroupImages';
options.validate = true;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await GroupImage.bulkCreate([
    {
      groupId: 1,
      imageUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg',
      preview: true
    },
    {
      groupId: 1,
      imageUrl: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg',
      preview: false
    },
    {
      groupId: 3,
      imageUrl: 'https://images.pexels.com/photos/4004426/pexels-photo-4004426.jpeg',
      preview: true
    },
    {
      groupId: 2,
      imageUrl: 'https://images.pexels.com/photos/23092004/pexels-photo-23092004/free-photo-of-famous-billiard-club-811-in-moscow-atmosphere-inside.jpeg',
      preview: true
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'GroupImages';
    return queryInterface.bulkDelete(options, null, {})
  }
};
