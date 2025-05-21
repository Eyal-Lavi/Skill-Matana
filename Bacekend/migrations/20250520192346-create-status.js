'use strict';
/** @type {import('sequelize-cli').Migration} */

const StatusModel = require('../models/status');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(StatusModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(StatusModel);
    await queryInterface.dropTable(tableName);
  }
};