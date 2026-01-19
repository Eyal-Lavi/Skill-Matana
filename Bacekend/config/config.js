const dotenv = require('dotenv');
dotenv.config();

module.exports= {
  "development": {
    "username": process.env.DB_USER_LOCAL,
    "password": process.env.DB_PASS_LOCAL,
    "database": process.env.DB_NAME_LOCAL,
    "host": process.env.DB_HOST_LOCAL,
    "port": process.env.DB_PORT_LOCAL || 5432,
    "dialect": "postgres",
    "timezone": "+00:00",
    "dialectOptions": {
      "ssl": process.env.DB_SSL_LOCAL === "true" ? {
        "require": true,
        "rejectUnauthorized": false
      } : false
    }
  },
  "test": {
    "username": process.env.DB_USER_DEV,
    "password": process.env.DB_PASS_DEV,
    "database": process.env.DB_NAME_DEV,
    "host": process.env.DB_HOST_DEV,
    "port": process.env.DB_PORT_DEV || 5432,
    "dialect": "postgres",
    "timezone": "+00:00",
    "dialectOptions": {
      "ssl": process.env.DB_SSL_DEV === "true" ? {
        "require": true,
        "rejectUnauthorized": false
      } : false
    }
  },
  "production": {
    "username": process.env.DB_USER_PROD,
    "password": process.env.DB_PASS_PROD,
    "database": process.env.DB_NAME_PROD,
    "host": process.env.DB_HOST_PROD,
    "port": process.env.DB_PORT_PROD || 5432,
    "dialect": "postgres",
    "timezone": "+00:00",
    "dialectOptions": {
      "ssl": process.env.DB_SSL_PROD === "true" ? {
        "require": true,
        "rejectUnauthorized": false
      } : false
    }
  }
}
