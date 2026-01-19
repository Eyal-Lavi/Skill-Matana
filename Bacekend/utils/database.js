const {Sequelize} = require('sequelize');
const configSettings = require('../config/config');
const ENV = process.env.NODE_ENV || 'development';

const credentials = configSettings[ENV];

const sequelize = new Sequelize(credentials.database, credentials.username, credentials.password, {
    host: credentials.host,
    port: credentials.port,
    dialect: credentials.dialect,
    timezone: credentials.timezone,
    dialectOptions: credentials.dialectOptions,
    logging: false
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