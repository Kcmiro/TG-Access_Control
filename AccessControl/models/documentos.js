const Sequelize = require("sequelize");
const connection = require("../database/database");

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

//documentos.sync({ force: true });

module.exports = documentos;
