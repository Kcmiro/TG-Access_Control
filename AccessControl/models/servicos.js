const Sequelize = require('sequelize');
const connection = require('../database/database')


const servico = connection.define('servico',{
    servico_nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    servico_descricao:{
        type: Sequelize.STRING,
        allowNull: true
    }
});


//servico.sync({force: true});

module.exports = servico;