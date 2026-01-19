'use strict';
const data = require('../data/connections.json');
const ConnectionModel = require('../models/connection');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(ConnectionModel.tableName, data.map(connection => ({
      ...connection,
      createdAt: now,
      updatedAt: now
    })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(ConnectionModel.tableName, null, {});
  }
};

