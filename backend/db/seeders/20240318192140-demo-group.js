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
      organizerId: 1,
      name: 'Board Game Aficionados',
      about: "A community for board game enthusiasts to explore and enjoy new and classic board games together.",
      type: 'In-Person',
      private: true,
      city: 'Gameville',
      state: 'NY'
    },
    {
      organizerId: 2,
      name: 'Dungeons & Dragons Quest',
      about: "Dive into epic adventures in our D&D campaign, open to both new and experienced players!",
      type: 'Online',
      private: true,
      city: 'Fantasy Realm',
      state: 'TX'
    },
    {
      organizerId: 3,
      name: 'RPG Heroes',
      about: "A gathering for fans of role-playing games to share stories, strategies, and new game recommendations.",
      type: 'Online',
      private: false,
      city: 'Adventure Town',
      state: 'FL'
    },
    {
      organizerId: 4,
      name: 'Magic: The Gathering Duelists',
      about: "Join us for friendly matches and tournaments of Magic: The Gathering!",
      type: 'In-Person',
      private: false,
      city: 'Card Kingdom',
      state: 'WA'
    },
    {
      organizerId: 5,
      name: 'Video Game Champions',
      about: "Compete with fellow gamers in weekly online tournaments of popular games.",
      type: 'Online',
      private: false,
      city: 'Victory Lane',
      state: 'IL'
    },
    {
      organizerId: 6,
      name: 'Tabletop Tacticians',
      about: "Explore a variety of tabletop games with strategy enthusiasts in a fun environment.",
      type: 'In-Person',
      private: true,
      city: 'Strategy City',
      state: 'CO'
    },
    {
      organizerId: 7,
      name: 'Cosplay & Gaming Meetup',
      about: "Combine your love for gaming and cosplay in a fun meetup where we play games in costume!",
      type: 'In-Person',
      private: false,
      city: 'Cosplay World',
      state: 'NV'
    },
    {
      organizerId: 8,
      name: 'D&D Storytellers Guild',
      about: "Join our creative group of DMs and players as we craft immersive stories and campaigns.",
      type: 'Online',
      private: true,
      city: 'Storyland',
      state: 'OR'
    },
    {
      organizerId: 9,
      name: 'Escape Room Gamers',
      about: "Team up to solve puzzles and escape rooms, both virtual and in-person.",
      type: 'In-Person',
      private: false,
      city: 'Puzzle Park',
      state: 'TX'
    },
    {
      organizerId: 10,
      name: 'Retro Gaming Society',
      about: "Relive the classics! Join us to play retro video games and discuss their impact on gaming culture.",
      type: 'In-Person',
      private: true,
      city: 'Nostalgia City',
      state: 'PA'
    },
  ], {validate: true});
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
