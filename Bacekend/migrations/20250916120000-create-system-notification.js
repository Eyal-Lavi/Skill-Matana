'use strict';
/** @type {import('sequelize-cli').Migration} */

const SystemNotificationModel = require('../models/systemNotification');
const { getModelAttributes } = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const { tableName, attributes } = getModelAttributes(SystemNotificationModel);
    return queryInterface.createTable(tableName, attributes);
  },
  async down(queryInterface, Sequelize) {
    const { tableName } = getModelAttributes(SystemNotificationModel);
    await queryInterface.dropTable(tableName);
  }
};

