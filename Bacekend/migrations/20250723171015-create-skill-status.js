'use strict';
/** @type {import('sequelize-cli').Migration} */

const StatusSkillModel = require('../models/statusSkill');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(StatusSkillModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(StatusSkillModel);
    await queryInterface.dropTable(tableName);
  }
};