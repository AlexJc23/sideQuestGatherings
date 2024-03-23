'use strict';


const { Attendee, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Attendees';
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
   await Attendee.bulkCreate([
      {
        userId: 1,
        eventId: 1,
        status: 'Attending'
      },
      {
        userId: 1,
        eventId: 2,
        status: 'Attending'
      },
      {
        userId: 2,
        eventId: 3,
        status: 'Attending'
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
    options.tableName = 'Attendees';
    return queryInterface.bulkDelete(options, null, {})
  }
};
