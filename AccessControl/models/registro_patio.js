const Sequelize = require('sequelize');
const connection = require('../database/database');
const { toDefaultValue } = require('sequelize/lib/utils');

const usuario = require('./usuario');
const bicicletario = require('./registro_chave');
const entregas = require('./entregas');
const servico = require('./servicos');
const registro_chave = require('./registro_chave');

const registro_patio = connection.define('registro_patio',{
    patio_horaentrada:{
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false
    },
    patio_horasaida: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false
    } 
});


registro_patio.belongsTo(usuario);
registro_patio.belongsTo(entregas);
registro_patio.belongsTo(servico);
registro_patio.belongsTo(registro_chave);
registro_patio.belongsTo(bicicletario);

//registro_patio.sync({force: true});

module.exports = registro_patio;