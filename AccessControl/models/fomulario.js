const Sequelize = require("sequelize");
const connection = require("../database/database");

const form = connection.define("formularios", {
  form_nome: { type: Sequelize.STRING(40), allowNull: false },
  form_descricao: {
    type: Sequelize.TEXT("long"),
    allowNull: true,
  },
  form_placa: {
    type: Sequelize.CHAR(7),
    allowNull: false,
    unique: true,
  },
  form_modelo: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  form_cpf: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    unique: true,
  },

  form_cnh: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    unique: true,
  },

  form_empresa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  form_tipo: {
    type: Sequelize.ENUM("SERIVICOS", "ENTREGAS"),
    allowNull: false,
  },
});

//form.sync({ force: true });

module.exports = form;
