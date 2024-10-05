const Sequelize = require('sequelize');
const connection = require('../database/database')

const entregas = require('../models/entregas');
const servico = require('../models/servicos');


const veiculos = connection.define('veiculos',{
    veiculos_placa:{
        type: Sequelize.CHAR(7),
        allowNull: false,
        unique: true
    },
    veiculos_modelo: {
        type: Sequelize.STRING(20),
        allowNull: false
    }
});

veiculos.belongsTo(entregas);
veiculos.belongsTo(servico);


//veiculos.sync({force: true});

module.exports = veiculos;