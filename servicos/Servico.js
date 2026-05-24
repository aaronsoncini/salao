const Sequelize = require("sequelize");
const connection = require("../database/database");

const Agendamento = require("../agendamentos/Agendamento");

const Servico = connection.define('servicos',{
    nomeServico:{
        type: Sequelize.STRING,
        allowNull: false
    },
    valorServico:{
        type:Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
})

Agendamento.belongsTo(Servico); //um agendamento tem um serviço
Servico.hasMany(Agendamento); //um serviço tem vários agendamentos

//Servico.sync({force: true});

module.exports = Servico;