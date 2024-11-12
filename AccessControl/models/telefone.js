const Sequelize = require("sequelize");
const connection = require("../database/database");

const entregas = require("../models/entregas");
const servico = require("../models/servicos");
const bicicletario = require("../models/bicicletario");

const telefones = connection.define("telefones", {
  telefone: {
    type: Sequelize.STRING(15),
    allowNull: false,
    unique: true,
  },
});

telefones.belongsTo(servico);
telefones.belongsTo(bicicletario);

//telefones.sync({ force: true });

module.exports = telefones;
