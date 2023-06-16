require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.PROD_USER,
    password: process.env.PROD_PASSWORD,
    database: process.env.PROD_DATABASE,
    host: process.env.PROD_HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
