const Sequelize = require("sequelize");
const connection = require("../database/database");

const veiculos = require("./veiculos");
const telefone = require("./telefone");
const documentos = require("./documentos");

const entregas = connection.define("entregas", {
  entregas_nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

entregas.belongsTo(veiculos);
entregas.belongsTo(telefone);
entregas.belongsTo(documentos);

//entregas.sync({ force: true });

module.exports = entregas;
