'use strict';
const data = require('../data/skills.json');
const SkillModel = require('../models/skill');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

 

    await queryInterface.bulkInsert(SkillModel.tableName, data.map(skill => ({ ...skill })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(SkillModel.tableName, null, {});
  }
};
