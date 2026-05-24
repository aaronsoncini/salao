const Sequelize = require("sequelize");
const connection = require("../database/database");
const {DataTypes} = require('sequelize');

const Ocupado = connection.define('ocupados', {
    diaOcupado:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horarioOcupado:{
        type: Sequelize.STRING,
        allowNull: false
    },
    diaInteiro: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

//Ocupado.sync({force: true});

module.exports = Ocupado;