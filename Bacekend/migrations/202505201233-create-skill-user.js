'use strict';
/** @type {import('sequelize-cli').Migration} */

const SkillUser = require('../models/skillUser');
const {getModelAttributes} = require('../utils/database');

module.exports = {
  up(queryInterface, Sequelize) {
    const {tableName , attributes} = getModelAttributes(SkillUser);

    return queryInterface.createTable(tableName,attributes);
  },
  async down(queryInterface, Sequelize) {
    const {tableName} = getModelAttributes(SkillUser);
    await queryInterface.dropTable(tableName);
  }
};