const Sequelize = require('sequelize');
const connection = require('../database/database')


const Entregas = connection.define('entregas',{
    entregas_nome:{
        type: Sequelize.STRING,
        allowNull: false
    }
});


//Entregas.sync({force: true});

module.exports = entregas;
