const Sequelize = require("sequelize");
const connection = require("../database/database");
const {DataTypes} = require('sequelize');

const Agendamento = connection.define('agendamentos', {
    nomeCliente:{
        type: Sequelize.STRING,
        allowNull: false
    },
    telefoneCliente:{
        type: Sequelize.STRING,
        allowNull: false
    },
    servicoId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'servicos',
            key: 'id'
        }
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

//criar entidade forte primeiro
//Agendamento.sync({force: true});

module.exports = Agendamento;