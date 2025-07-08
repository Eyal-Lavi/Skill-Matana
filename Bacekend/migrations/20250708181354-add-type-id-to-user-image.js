'use strict';
/** @type {import('sequelize-cli').Migration} */

const UserImageModel = require('../models/userImage');
const { getModelAttributes } = require('../utils/database');

module.exports = {
  async up(queryInterface, Sequelize) {
    const { attributes } = getModelAttributes(UserImageModel);
    const typeIdAttribute = attributes.typeId;
    return queryInterface.addColumn('user_image', 'type_id', typeIdAttribute);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user_image', 'type_id');
  }
};
