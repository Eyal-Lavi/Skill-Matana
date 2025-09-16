'use strict';
/** @type {import('sequelize-cli').Migration} */

const MeetingAlertModel = require('../models/meetingAlert');
const { getModelAttributes } = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const { tableName, attributes } = getModelAttributes(MeetingAlertModel);
    return queryInterface.createTable(tableName, attributes);
  },
  async down(queryInterface, Sequelize) {
    const { tableName } = getModelAttributes(MeetingAlertModel);
    await queryInterface.dropTable(tableName);
  }
};

