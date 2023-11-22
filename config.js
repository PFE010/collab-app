var dotenv = require('dotenv');
dotenv.config();

const config = {
    db: {
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "test"
    }
  };

module.exports = config;