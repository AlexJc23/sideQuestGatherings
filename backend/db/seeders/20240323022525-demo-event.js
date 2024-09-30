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
        name: 'Epic Gaming Tournament',
        type: 'Online',
        capacity: 50,
        price: 10.00,
        description: 'Join us for an epic gaming tournament featuring popular titles and amazing prizes!',
        startDate: '2024-10-01 14:00:00',
        endDate: '2024-10-01 18:00:00',
      },
      {
        groupId: 2,
        venueId: 2,
        name: 'Board Game Night Extravaganza',
        type: 'In Person',
        capacity: 30,
        price: 15.00,
        description: 'An evening filled with laughter and strategy as we dive into our favorite board games!',
        startDate: '2024-10-05 18:00:00',
        endDate: '2024-10-05 23:00:00',
      },
      {
        groupId: 3,
        venueId: 3,
        name: 'Dungeons & Dragons One-Shot Adventure',
        type: 'In Person',
        capacity: 6,
        price: 20.00,
        description: 'Experience a thrilling one-shot D&D adventure with seasoned Dungeon Masters!',
        startDate: '2024-10-10 17:00:00',
        endDate: '2024-10-10 22:00:00',
      },
      {
        groupId: 1,
        venueId: 1,
        name: 'Magic: The Gathering Casual Play',
        type: 'Online',
        capacity: 40,
        price: 5.00,
        description: 'Gather online for some casual Magic: The Gathering games and socialize with other players!',
        startDate: '2024-10-12 16:00:00',
        endDate: '2024-10-12 20:00:00',
      },
      {
        groupId: 2,
        venueId: 2,
        name: 'Video Game Night - Retro Classics',
        type: 'In Person',
        capacity: 25,
        price: 10.00,
        description: 'Join us for a night of retro video games and nostalgia! Bring your favorite games and memories.',
        startDate: '2024-10-15 19:00:00',
        endDate: '2024-10-15 23:00:00',
      },
    ], { validate: true });
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
