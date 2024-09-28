const Sequelize = require('sequelize'); 

const connection = new Sequelize(
    'ControleDeAcesso',
    'rafael',
    'R@f@el23',
    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
    }
    
);

module.exports = connection;