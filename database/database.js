//utilizando o sequelize para a comunicação com o banco de dados
require('dotenv').config();

const Sequelize = require("sequelize");

const connection = new Sequelize('salao',process.env.DB_USER,process.env.DB_PASS,{
    host:'localhost',
    dialect:'mysql',
    timezone: '-03:00'
});

module.exports = connection;