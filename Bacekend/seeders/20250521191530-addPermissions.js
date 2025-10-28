'use strict';
const data = require('../data/permissions.json');
const PermissionModel = require('../models/permission');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {



    await queryInterface.bulkInsert(PermissionModel.tableName, data.map(permission => ({...permission })), {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(PermissionModel.tableName, null, {});
  }
};
