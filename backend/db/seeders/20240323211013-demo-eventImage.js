'use strict';

'use strict';
const { EventImage, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'EventImages';
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
    await EventImage.bulkCreate([
      {
        eventId: 1,
        imageUrl: 'testpic1.gif',
        preview: true,
      },
      {
        eventId: 1,
        imageUrl: 'testpic2.png',
        preview: true,
      },
      {
        eventId: 3,
        imageUrl: 'testpic3.gif',
        preview: true,
      },
      {
        eventId: 2,
        imageUrl: 'testpic4.gif',
        preview: false,
      },
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages';
    return queryInterface.bulkDelete(options, null, {})
  }
};
