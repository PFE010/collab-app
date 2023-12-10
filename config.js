var dotenv = require('dotenv');
dotenv.config();

const config = {
    db: {
      host: "mysql-22a42974-etsmtl-pfe010.a.aivencloud.com",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "defaultdb",
      port: "28279"
    }
  };

module.exports = config;