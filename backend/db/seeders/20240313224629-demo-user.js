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
    },
    {
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'AliceSmith1',
      email: 'alice.smith@gmail.com',
      hashedPassword: bcrypt.hashSync('alicePass1')
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      username: 'JohnDoe21',
      email: 'john.doe21@gmail.com',
      hashedPassword: bcrypt.hashSync('johnPass21')
    },
    {
      firstName: 'Sara',
      lastName: 'Connor',
      username: 'TerminatorFan',
      email: 'sara.connor@gmail.com',
      hashedPassword: bcrypt.hashSync('connor1234')
    },
    {
      firstName: 'Michael',
      lastName: 'Jordan',
      username: 'MJ23',
      email: 'mjordan23@gmail.com',
      hashedPassword: bcrypt.hashSync('jumpman23')
    },
    {
      firstName: 'Emily',
      lastName: 'Brown',
      username: 'EmilyB',
      email: 'emily.brown@yahoo.com',
      hashedPassword: bcrypt.hashSync('brownie456')
    },
    {
      firstName: 'David',
      lastName: 'Miller',
      username: 'DavidM',
      email: 'david.miller@hotmail.com',
      hashedPassword: bcrypt.hashSync('david321')
    },
    {
      firstName: 'Linda',
      lastName: 'Jones',
      username: 'LindaJ89',
      email: 'linda.jones@gmail.com',
      hashedPassword: bcrypt.hashSync('joneslinda')
    },
    {
      firstName: 'Chris',
      lastName: 'Evans',
      username: 'CaptainAmerica',
      email: 'chris.evans@aol.com',
      hashedPassword: bcrypt.hashSync('americaCap')
    },
    {
      firstName: 'Sophia',
      lastName: 'Williams',
      username: 'SophiaW',
      email: 'sophia.williams@gmail.com',
      hashedPassword: bcrypt.hashSync('will2023')
    },
    {
      firstName: 'James',
      lastName: 'Anderson',
      username: 'JamesA',
      email: 'james.anderson@gmail.com',
      hashedPassword: bcrypt.hashSync('andersonjames')
    },
    {
      firstName: 'Olivia',
      lastName: 'Taylor',
      username: 'LivTaylor',
      email: 'olivia.taylor@gmail.com',
      hashedPassword: bcrypt.hashSync('tay123liv')
    },
    {
      firstName: 'Robert',
      lastName: 'Downey',
      username: 'IronMan',
      email: 'robert.downey@gmail.com',
      hashedPassword: bcrypt.hashSync('stark3000')
    }
  ], {validate: true});
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
