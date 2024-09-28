const Sequelize = require('sequelize');
const connection = require('../database/database')

const lojas = connection.define('lojas',{
    lojaNome:{
        type: Sequelize.STRING,
        allowNull: false
    }
});


//lojas.sync({force: true});
//Teste para o Git_Hub
module.exports = lojas;
console.log("Teste");