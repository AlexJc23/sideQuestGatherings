'use strict';

const { Group, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Groups';
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
   await Group.bulkCreate([
    {
      organizerId: 23,
      name: 'Test1',
      about: 'Test1',
      type: 'Test1',
      private: true,
      city: 'Test',
      state: 'OH'
    },
    {
      organizerId: 22,
      name: 'Test2',
      about: 'Test2',
      type: 'Test2',
      private: false,
      city: 'Test',
      state: 'MI'
    },
    {
      organizerId: 23,
      name: 'Test3',
      about: 'Test3',
      type: 'Test3',
      private: true,
      city: 'Test',
      state: 'TX'
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
    options.tableName = 'Groups';
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ['Test1', 'Test2', 'Test3']}
    }, {})
  }
};
