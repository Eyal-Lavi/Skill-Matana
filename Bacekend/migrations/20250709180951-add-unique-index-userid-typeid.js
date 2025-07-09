'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addIndex('user_image', ['user_id', 'type_id'], {
      name: 'user_image_userid_typeid_unique',
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeIndex('user_image', 'user_image_userid_typeid_unique');
  }
};
