const Sequelize = require("sequelize");
const connection = require("../database/database");
const { options } = require("pdfkit");

const chaves = connection.define("chaves", {
  chave_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: false,
    unique: true,
    primaryKey: true,
  },
  chave_nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

chaves.beforeCreate((chave, options) => {
  if (chave.chave_nome) {
    chave.chave_nome = chave.chave_nome.toUpperCase();
  }
});

chaves.beforeUpdate((chave, options) => {
  if (chave.chave_nome) {
    chave.chave_nome = chave.chave_nome.toUpperCase();
  }
});

//chaves.sync({force: true});

module.exports = chaves;
