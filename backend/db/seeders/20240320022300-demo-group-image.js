'use strict';
const { GroupImage, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'GroupImages';
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
   await GroupImage.bulkCreate([
    {
      groupId: 5,
      imageUrl: 'https://store.hp.com/app/assets/images/uploads/prod/top-video-game-tournaments-hero1570551594765110.jpg',
      preview: true
    },
    {
      groupId: 3,
      imageUrl: 'https://zgames.ae/assets/uploads/Top-10-Best-RPG-Games.jpg',
      preview: true
    },
    {
      groupId: 1,
      imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmOVs3w1oPPqk6zwBKMYiBssRUQXtUzXgF00zXTc_U3QfOSObJhucY5tIDzPmFYvjjlVSYpnY5IfzIvw275qymAJSjDpQnTMMrvI11gahmJyWg1UyQ4pwdWTCelPVuKseu2BYcyg/s1600/board-games-for-kids-ages-6-to-12.jpg',
      preview: true
    },
    {
      groupId: 2,
      imageUrl: 'https://www.orcnroll.com/wp-content/uploads/2019/10/image.jpeg',
      preview: true
    },
    {
      groupId: 4,
      imageUrl: 'https://assetsio.gnwcdn.com/mtg-modern-horizons-2-cards.png',
      preview: true
    },
    {
      groupId: 6,
      imageUrl: 'https://www.harrisburgu.edu/wp-content/uploads/table-top-games-1183x686.jpg',
      preview: true
    },
    {
      groupId: 7,
      imageUrl: 'https://www.xcoser.com/cdn/shop/articles/top-10-cosplay-ideas-for-guys-in-2020-699988_800x.jpg',
      preview: false
    },
    {
      groupId: 8,
      imageUrl: 'https://www.orcnroll.com/wp-content/uploads/2019/10/image.jpeg',
      preview: true
    },
    {
      groupId: 9,
      imageUrl: 'https://www.brightful.me/content/images/2021/06/4-3.jpg',
      preview: true
    },
    {
      groupId: 10,
      imageUrl: 'https://miro.medium.com/v2/resize:fit:1400/1*jczW72gjOU2T_WG69L7U0A.png',
      preview: true
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
    options.tableName = 'GroupImages';
    return queryInterface.bulkDelete(options, null, {})
  }
};
