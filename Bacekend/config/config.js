const dotenv = require('dotenv');
dotenv.config();

console.log('DB_USER_LOCAL:', process.env.DB_USER_LOCAL);
console.log('DB_PASS_LOCAL:', process.env.DB_PASS_LOCAL);
console.log('DB_NAME_LOCAL:', process.env.DB_NAME_LOCAL);
console.log('DB_HOST_LOCAL:', process.env.DB_HOST_LOCAL);

module.exports= {
  "development": {
    "username": process.env.DB_USER_LOCAL,
    "password": process.env.DB_PASS_LOCAL,
    "database": process.env.DB_NAME_LOCAL,
    "host": process.env.DB_HOST_LOCAL,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DB_USER_DEV,
    "password": process.env.DB_PASS_DEV,
    "database": process.env.DB_NAME_DEV,
    "host": process.env.DB_HOST_DEV,
    "dialect": "mysql"
  },
  "production": {
    "username":process.env.DB_USER_PROD,
    "password": process.env.DB_PASS_PROD,
    "database": process.env.DB_NAME_PROD,
    "host": process.env.DB_HOST_PROD,
    "dialect": "mysql"
  }
}
