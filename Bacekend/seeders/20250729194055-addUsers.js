'use strict';
const data = require('../data/users.json'); 
const bcrypt = require('bcrypt');
const UserModel = require('../models/user'); 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;

    const usersWithHashedPasswords = await Promise.all(
      data.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    await queryInterface.bulkInsert(UserModel.tableName, usersWithHashedPasswords, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(UserModel.tableName, null, {});
  }
};
