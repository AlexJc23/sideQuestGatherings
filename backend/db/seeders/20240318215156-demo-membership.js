'use strict';

const { Membership, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Memberships';
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
   await Membership.bulkCreate([
    {
      groupId: 2,
      userId: 1,
      status: 'OWNER'
    },
    {
      groupId: 3,
      userId: 1,
      status: 'MEMBER'
    },
    {
      groupId: 2,
      userId: 3,
      status: 'MEMBER'
    },
    {
      groupId: 3,
      userId: 2,
      status: 'OWNER'
    },
    {
      groupId: 1,
      userId: 1,
      status: 'OWNER'
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
    options.tableName = 'Memberships';
    return queryInterface.bulkDelete(options, null, {})
  }
};
