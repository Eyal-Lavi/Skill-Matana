'use strict';
/** @type {import('sequelize-cli').Migration} */

const SkillRequestsModel = require('../models/skillRequests');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(SkillRequestsModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(SkillRequestsModel);
    await queryInterface.dropTable(tableName);
  }
};