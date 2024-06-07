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
        imageUrl: 'https://images.pexels.com/photos/1601774/pexels-photo-1601774.jpeg',
        preview: true,
      },
      {
        eventId: 1,
        imageUrl: 'https://images.pexels.com/photos/4841182/pexels-photo-4841182.jpeg',
        preview: true,
      },
      {
        eventId: 3,
        imageUrl: 'https://images.pexels.com/photos/20551826/pexels-photo-20551826/free-photo-of-facade-of-a-postindustrial-building-with-a-venue.jpeg',
        preview: true,
      },
      {
        eventId: 2,
        imageUrl: 'https://images.pexels.com/photos/10543176/pexels-photo-10543176.jpeg',
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
