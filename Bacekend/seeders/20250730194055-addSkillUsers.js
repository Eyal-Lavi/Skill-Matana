'use strict';
const data = require('../data/skillUsers.json');
const SkillUserModel = require('../models/skillUser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(SkillUserModel.tableName, data.map(skillUser => ({ ...skillUser })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(SkillUserModel.tableName, null, {});
  }
};

