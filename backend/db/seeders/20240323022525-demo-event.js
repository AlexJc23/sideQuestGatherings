'use strict';

const { Event, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Events';
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
   await Event.bulkCreate([
      {
        groupId: 1,
        venueId: 1,
        name: 'Test1',
        type: 'Test1',
        capacity: 45,
        price: 1.00,
        description: 'TEST1',
        startDate: '2024-06-11',
        endDate: '2024-06-12',
      },
      {
        groupId: 1,
        venueId: 2,
        name: 'Test2',
        type: 'Test2',
        capacity: 45,
        price: 50.50,
        description: 'TEST2',
        startDate: '2024-06-09',
        endDate: '2024-06-15',
      },
      {
        groupId: 3,
        venueId: 3,
        name: 'Test3',
        type: 'Test3',
        capacity: 45,
        price: 89.00,
        description: 'TEST3',
        startDate: '2024-06-11',
        endDate: '2024-06-12',
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
    options.tableName = 'Events';
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ['Test1', 'Test2', 'Test3']}
    }, {})
  }
};
