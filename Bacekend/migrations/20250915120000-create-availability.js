'use strict';
/** @type {import('sequelize-cli').Migration} */

const AvailabilityModel = require('../models/availability');
const { getModelAttributes } = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const { tableName, attributes } = getModelAttributes(AvailabilityModel);
    return queryInterface.createTable(tableName, attributes);
  },
  async down(queryInterface, Sequelize) {
    const { tableName } = getModelAttributes(AvailabilityModel);
    await queryInterface.dropTable(tableName);
  }
};

