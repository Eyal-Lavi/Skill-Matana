'use strict';
/** @type {import('sequelize-cli').Migration} */

const UserImageModel = require('../models/userImage');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(UserImageModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(UserImageModel);
    await queryInterface.dropTable(tableName);
  }
};