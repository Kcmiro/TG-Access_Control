const Sequelize = require('sequelize');
const connection = require('../database/database')


const chaves = connection.define('chaves',{
    chave_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: false,
        unique: true,
        primaryKey: true
    },
    chave_nome:{
        type: Sequelize.STRING,
        allowNull:false
    }
});


//chaves.sync({force: true});

module.exports = chaves;