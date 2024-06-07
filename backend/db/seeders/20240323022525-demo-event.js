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
        type: 'Online',
        capacity: 45,
        price: 1.00,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae sapien pellentesque habitant morbi. Ipsum dolor sit amet consectetur adipiscing elit ut. Feugiat nibh sed pulvinar proin gravida. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Lorem ipsum dolor sit amet consectetur. Vitae aliquet nec ullamcorper sit amet risus nullam eget. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Massa massa ultricies mi quis hendrerit dolor. Eu turpis egestas pretium aenean pharetra magna. ',
        startDate: '2024-06-11 12:00:00',
        endDate: '2024-06-12 11:00:00',
      },
      {
        groupId: 1,
        venueId: 2,
        name: 'Test2',
        type: 'Online',
        capacity: 45,
        price: 50.50,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae sapien pellentesque habitant morbi. Ipsum dolor sit amet consectetur adipiscing elit ut. Feugiat nibh sed pulvinar proin gravida. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Lorem ipsum dolor sit amet consectetur. Vitae aliquet nec ullamcorper sit amet risus nullam eget. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Massa massa ultricies mi quis hendrerit dolor. Eu turpis egestas pretium aenean pharetra magna. ',
        startDate: '2024-06-09 12:00:00',
        endDate: '2024-06-15 12:00:00',
      },
      {
        groupId: 3,
        venueId: 3,
        name: 'Test3',
        type: 'In Person',
        capacity: 45,
        price: 89.00,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae sapien pellentesque habitant morbi. Ipsum dolor sit amet consectetur adipiscing elit ut. Feugiat nibh sed pulvinar proin gravida. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Lorem ipsum dolor sit amet consectetur. Vitae aliquet nec ullamcorper sit amet risus nullam eget. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Massa massa ultricies mi quis hendrerit dolor. Eu turpis egestas pretium aenean pharetra magna. ',
        startDate: '2024-06-11 12:00:00',
        endDate: '2024-06-12 12:00:00',
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
