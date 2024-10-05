const Sequelize = require('sequelize');
const connection = require('../database/database');

const Entregas = require('../models/entregas');
const Servico = require('../models/servicos');

const Documentos = connection.define('documentos',{
    doc_cnh:{
        type: Sequelize.CHAR(11),
        allowNull: false,
        unique: true
        
    },

    doc_cnh:{
        type: Sequelize.CHAR(11),
        allowNull: false,
        unique: true
    },

    doc_empresa: {
        type: Sequelize.STRING,
        allowNull: false,
        allowNull: true
    }
});

Documentos.belongsTo(Entregas);
Documentos.belongsTo(Servico);


//Documentos.sync({force: true});

module.exports = Documentos;