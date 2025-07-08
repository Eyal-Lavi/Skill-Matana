'use strict';
const data = require('../data/imageType.json');
const ImageType = require('../models/imageType');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(ImageType.tableName, data.map(type => ({...type})), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(ImageType.tableName, null, {});
  }
};