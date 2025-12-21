'use strict';

/** @type {import('sequelize-cli').Migration} */
const PendingRegistration = require('../models/pendingRegistration');
const { getModelAttributes } = require('../utils/database');

module.exports = {
  async up(queryInterface, Sequelize) {
    const { tableName, attributes } = getModelAttributes(PendingRegistration);
    return queryInterface.createTable(tableName, attributes);
  },

  async down(queryInterface, Sequelize) {
    const { tableName } = getModelAttributes(PendingRegistration);
    await queryInterface.dropTable(tableName);
  }
};

