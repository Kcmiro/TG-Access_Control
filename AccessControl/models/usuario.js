const Sequelize = require('sequelize');
const connection = require('../database/database')


const usuario = connection.define('usuario',{
    usuario_nome:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    usuario_senha:{
        type: Sequelize.STRING,
        allowNull: false
    },
    usuario_nivel:{
        type: Sequelize.ENUM("OPERADOR","ADM","CFTV"),
        allowNull: false
    }
});



//usuario.sync({force: true});

module.exports = usuario;