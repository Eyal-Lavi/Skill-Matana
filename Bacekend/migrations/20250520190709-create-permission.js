'use strict';

const Permission = require('../models/permission');
const { getModelAttributes } = require('../utils/database')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const { tableName , attributes } = getModelAttributes(Permission);
    await queryInterface.createTable(tableName, attributes);
  },

  async down (queryInterface, Sequelize) {

    const { tableName } = getModelAttributes(Permission);
    await queryInterface.dropTable(tableName);
  }
};
