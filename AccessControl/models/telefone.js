const Sequelize = require("sequelize");
const connection = require("../database/database");

const telefones = connection.define("telefones", {
  telefone: {
    type: Sequelize.STRING(15),
    allowNull: false,
    unique: true,
  },
});

telefones.beforeCreate((telefone, options) => {
  // Remove qualquer formatação do CPF
  if (telefone.telefone) {
    telefone.telefone = telefone.telefone.replace(/\D/g, ""); // Remove tudo que não for número
  }
});

telefones.beforeUpdate((telefone, options) => {
  // Remove qualquer formatação do CPF
  if (telefone.telefone) {
    telefone.telefone = telefone.telefone.replace(/\D/g, ""); // Remove tudo que não for número
  }
});

//telefones.sync({ force: true });

module.exports = telefones;
