'use strict';
/** @type {import('sequelize-cli').Migration} */

const ImageTypeModel = require('../models/imageType');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(ImageTypeModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(ImageTypeModel);
    await queryInterface.dropTable(tableName);
  }
};