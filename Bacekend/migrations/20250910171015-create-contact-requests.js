'use strict';
/** @type {import('sequelize-cli').Migration} */

const ContactRequests = require('../models/contactRequests');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(ContactRequests);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(ContactRequests);
    await queryInterface.dropTable(tableName);
  }
};