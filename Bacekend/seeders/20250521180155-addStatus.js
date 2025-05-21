'use strict';
const data = require('../data/status.json');
const StatusModel = require('../models/status');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    // const createdAt = new Date();
    // const updatedAt = new Date();

    await queryInterface.bulkInsert(StatusModel.tableName, data.map(status => ({...status })), {});
    // await queryInterface.bulkInsert(StatusModel.tableName, data.map(status => ({ createdAt, updatedAt, ...status })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(StatusModel.tableName, null, {});
  }
};
