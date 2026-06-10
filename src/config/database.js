const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'SNKRS',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '@Axel9020',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
  }
);

module.exports = sequelize;