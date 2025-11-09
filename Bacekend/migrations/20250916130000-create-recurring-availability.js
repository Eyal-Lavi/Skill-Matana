'use strict';
/** @type {import('sequelize-cli').Migration} */

const RecurringAvailabilityModel = require('../models/recurringAvailability');
const { getModelAttributes } = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const { tableName, attributes } = getModelAttributes(RecurringAvailabilityModel);
    return queryInterface.createTable(tableName, attributes);
  },
  async down(queryInterface, Sequelize) {
    const { tableName } = getModelAttributes(RecurringAvailabilityModel);
    await queryInterface.dropTable(tableName);
  }
};

