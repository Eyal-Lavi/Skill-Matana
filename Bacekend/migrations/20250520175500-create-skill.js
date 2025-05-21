'use strict';
/** @type {import('sequelize-cli').Migration} */

const SkillModel = require('../models/skill');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(SkillModel);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(SkillModel);
    await queryInterface.dropTable(tableName);
  }
};