'use strict';

/** @type {import('sequelize-cli').Migration} */
const PasswordResetToken = require('../models/passwordResetToken');
const { getModelAttributes } = require('../utils/database');
module.exports = {
  async up (queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(PasswordResetToken);

    return queryInterface.createTable(tableName , attributes);
  },

  async down (queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(PasswordResetToken);
    await queryInterface.dropTable(tableName);
  }
};
