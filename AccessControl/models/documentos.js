const Sequelize = require("sequelize");
const connection = require("../database/database");

const documentos = connection.define("documentos", {
  doc_cpf: {
    type: Sequelize.CHAR(11),
    allowNull: false,
  },

  doc_cnh: {
    type: Sequelize.CHAR(11),
    allowNull: false,
  },

  doc_empresa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

documentos.beforeCreate((documento, options) => {
  // Remove qualquer formatação do CPF
  if (documento.doc_cpf) {
    documento.doc_cpf = documento.doc_cpf.replace(/\D/g, ""); // Remove tudo que não for número
  }

  // Remove qualquer formatação da CNH
  if (documento.doc_cnh) {
    documento.doc_cnh = documento.doc_cnh.replace(/\D/g, ""); // Remove tudo que não for número
  }

  if (documento.doc_empresa) {
    documento.doc_empresa = documento.doc_empresa.toUpperCase();
  }
});

documentos.beforeUpdate((documento, options) => {
  // Remove formatação de CPF
  if (documento.doc_cpf) {
    documento.doc_cpf = documento.doc_cpf.replace(/\D/g, "");
  }

  // Remove formatação de CNH
  if (documento.doc_cnh) {
    documento.doc_cnh = documento.doc_cnh.replace(/\D/g, "");
  }
  if (documento.doc_empresa) {
    documento.doc_empresa = documento.doc_empresa.toUpperCase();
  }
});

//documentos.sync({});
//documentos.sync({ force: true });
module.exports = documentos;
