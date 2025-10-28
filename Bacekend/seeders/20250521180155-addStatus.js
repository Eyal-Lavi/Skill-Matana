'use strict';
const data = require('../data/status.json');
const StatusModel = require('../models/status');


module.exports = {
  async up(queryInterface, Sequelize) {

    

    await queryInterface.bulkInsert(StatusModel.tableName, data.map(status => ({...status })), {});
   
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(StatusModel.tableName, null, {});
  }
};
