const {Sequelize} = require('sequelize');
const configSettings = require('../config/config');
const ENV = process.env.NODE_ENV || 'development';

const credetials = configSettings[ENV];

const sequelize = new Sequelize(credetials.database , credetials.username , credetials.password , {
    host:credetials.host,
    dialect: credetials.dialect
});

const getModelAttributes = (model) => {
    const tableName = model.tableName;
    const attributes = {};
    for (const [key , value] of Object.entries(model.rawAttributes)){
      attributes[key] = value;
    }
    return {tableName , attributes};
}
module.exports = {
  sequelize,
  getModelAttributes
};