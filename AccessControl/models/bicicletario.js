const Sequelize = require("sequelize");
const connection = require("../database/database");
const telefone = require("../models/telefone");

const bicicletario = connection.define("bicicletario", {
  bike_nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bike_cor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bike_loja: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

bicicletario.belongsTo(telefone);

//bicicletario.sync({ force: true });

module.exports = bicicletario;
