const Sequelize = require("sequelize");
const connection = require("../database/database");

const servico = require("../models/servicos");

const documentos = connection.define("documentos", {
  doc_cpf: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    unique: true,
  },

  doc_cnh: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    unique: true,
  },

  doc_empresa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

documentos.belongsTo(servico);

//documentos.sync({ force: true });

module.exports = documentos;
