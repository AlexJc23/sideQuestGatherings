// EVERY seeder file
'use strict';

const { User, Sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Users';
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
   await User.bulkCreate([
    {
      firstName: 'Test1',
      lastName: 'Test1Last',
      username: 'TestUser1',
      email: 'testuser1@gmail.com',
      hashedPassword: bcrypt.hashSync('password1')
    },
    {
      firstName: 'Test2',
      lastName: 'Test2Last',
      username: 'TestUser2',
      email: 'testuser2@gmail.com',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      firstName: 'Test3',
      lastName: 'Test3Last',
      username: 'TestUser3',
      email: 'testuser3@gmail.com',
      hashedPassword: bcrypt.hashSync('password3')
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
    options.tableName = 'Users';
    return queryInterface.bulkDelete(options, {
      username: {[Op.in]: ['TestUser1', 'TestUser2', 'TestUser3']}
    }, {})
  }
};
