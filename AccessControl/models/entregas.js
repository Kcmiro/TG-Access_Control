const Sequelize = require('sequelize');
const connection = require('../database/database')


const Entregas = connection.define('Entregas',{
    entregas_nome:{
        type: Sequelize.STRING,
        allowNull: false
    }
});


//lojas.sync({force: true});

module.exports = lojas;
