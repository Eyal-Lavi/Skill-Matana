'use strict';
/** @type {import('sequelize-cli').Migration} */

const ContactRequestModel = require('../models/contactRequests');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(ContactRequestModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(ContactRequestModel);
    await queryInterface.dropTable(tableName);
  }
};