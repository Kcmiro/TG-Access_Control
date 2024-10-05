const Sequelize = require('sequelize');
const connection = require('../database/database')

const entregas = require('../models/entregas');
const servico = require('../models/servicos');
const bicicletario = require('../models/bicicletario');

const telefone = connection.define('telefone',{
    telefone:{
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
    }
});

telefone.belongsTo(entregas);
telefone.belongsTo(servico);
telefone.belongsTo(bicicletario);

//telefone.sync({force: true});

module.exports = telefone;