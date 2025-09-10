'use strict';
/** @type {import('sequelize-cli').Migration} */

const Connections = require('../models/connection');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(Connections);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(Connections);
    await queryInterface.dropTable(tableName);
  }
};