const Sequelize = require('sequelize');
const connection = require('../database/database')

const chaves = require('../models/chaves');

const registro_chave = connection.define('registros_chave',{
    rchave_nome:{
        type: Sequelize.STRING,
        allowNull:false
    },
    rchave_telefone:{
        type:Sequelize.STRING(15)
    },
    rchave_motivo:{
        type:Sequelize.TEXT('long')
    },
    rchave_observacao:{
        type:Sequelize.TEXT('long')
    }
});

registro_chave.belongsTo(chaves);

//registro_chave.sync({force: true});

module.exports = registro_chave;