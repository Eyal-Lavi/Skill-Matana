'use strict';
/** @type {import('sequelize-cli').Migration} */

const MeetingModel = require('../models/meeting');
const { getModelAttributes } = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const { tableName, attributes } = getModelAttributes(MeetingModel);
    return queryInterface.createTable(tableName, attributes);
  },
  async down(queryInterface, Sequelize) {
    const { tableName } = getModelAttributes(MeetingModel);
    await queryInterface.dropTable(tableName);
  }
};

