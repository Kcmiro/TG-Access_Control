const Sequelize = require("sequelize");
const connection = require("../database/database");

const entregas = connection.define("entregas", {
  entregas_nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

//entregas.sync({force: true});

module.exports = entregas;
