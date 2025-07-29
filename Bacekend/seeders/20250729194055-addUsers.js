'use strict';
const data = require('../data/skills.json');
const SkillModel = require('../models/skill');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    // const createdAt = new Date();
    // const updatedAt = new Date();

    await queryInterface.bulkInsert(SkillModel.tableName, data.map(skill => ({ ...skill })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(SkillModel.tableName, null, {});
  }
};
