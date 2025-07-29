'use strict';
const data = require('../data/userPermissions.json');
const UserPermissionModel = require('../models/userPermission');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    // const createdAt = new Date();
    // const updatedAt = new Date();

    await queryInterface.bulkInsert(UserPermissionModel.tableName, data.map(user => ({ ...user })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(UserPermissionModel.tableName, null, {});
  }
};
