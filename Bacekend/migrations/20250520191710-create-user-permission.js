'use strict';

/** @type {import('sequelize-cli').Migration} */
const UserPermission  = require('../models/userPermission')
const { getModelAttributes }  = require('../utils/database')

module.exports = {
  async up (queryInterface, Sequelize) {

    const { tableName , attributes } = getModelAttributes(UserPermission);
    await queryInterface.createTable(tableName, attributes);
  },

  async down (queryInterface, Sequelize) {

    const { tableName } = getModelAttributes(UserPermission);
    await queryInterface.dropTable(tableName);
  }
};
