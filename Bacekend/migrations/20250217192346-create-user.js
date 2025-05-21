'use strict';
/** @type {import('sequelize-cli').Migration} */

const UserModel = require('../models/user');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(UserModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(UserModel);
    await queryInterface.dropTable(tableName);
  }
};