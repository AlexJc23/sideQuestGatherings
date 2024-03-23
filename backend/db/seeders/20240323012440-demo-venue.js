'use strict';

const { Venue, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Venues';
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
   await Venue.bulkCreate([
    {
      groupId: 1,
      address: '123 Test Dr1',
      city: 'Testcity',
      state: 'MI',
      latitude: 33.748550,
      longitude: -84.391500
    },
    {
      groupId: 1,
      address: '123 Test Dr2',
      city: 'Testcity',
      state: 'MI',
      latitude: 33.748550,
      longitude: -84.391500
    },
    {
      groupId: 3,
      address: '123 Test Dr2',
      city: 'Testcity',
      state: 'MI',
      latitude: 33.748550,
      longitude: -84.391500
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
    options.tableName = 'Venues';
    return queryInterface.bulkDelete(options, null, {})
  }
};
