const Sequelize = require("sequelize");
const connection = require("../database/database");

const entregas = require("../models/entregas");
const servico = require("../models/servicos");

const lojas = connection.define("lojas", {
  lojaNome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

//lojas.sync({force: true});

module.exports = lojas;
