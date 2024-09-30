'use strict';

'use strict';
const { EventImage, Sequelize } = require('../models');
const Op = Sequelize.Op;


// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'EventImages';
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
    await EventImage.bulkCreate([
      {
        eventId: 1,
        imageUrl: 'https://toomanygames.com/wp-content/uploads/2023/05/Video-Game-Tournaments-at-TooManyGames-East-Coast-Gaming-Convention-Greater-Philadelphia-Expo-Center.png',
        preview: true,
      },
      {
        eventId: 2,
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/5a2af6428c56a8d78df97ef4/1519073875402-DNNDY6NZDX6YXR860MBR/IMG_5961.jpg',
        preview: true,
      },
      {
        eventId: 3,
        imageUrl: 'https://parental-control.flashget.com/wp-content/uploads/sites/3/2024/07/Overview-of-dnd-for-kids.jpg',
        preview: true,
      },
      {
        eventId: 4,
        imageUrl: 'https://static1.thegamerimages.com/wordpress/wp-content/uploads/2023/04/featuredimage-magicranked.jpg',
        preview: true,
      },
      {
        eventId: 5,
        imageUrl: 'https://www.bazaar-bazaar.co.uk/cdn/shop/collections/retro_game_wallpaper.jpg',
        preview: true,
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
    options.tableName = 'EventImages';
    return queryInterface.bulkDelete(options, null, {})
  }
};
