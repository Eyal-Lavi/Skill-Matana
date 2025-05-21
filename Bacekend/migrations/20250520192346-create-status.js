'use strict';
/** @type {import('sequelize-cli').Migration} */

const statusModel = require('../models/status');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(statusModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(statusModel);
    await queryInterface.dropTable(tableName);
  }
};