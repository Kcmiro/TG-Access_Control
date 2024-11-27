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
  status: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "entregas",
    validate: {
      isIn: [["entregas"]],
    },
  },
});

entregas.beforeCreate((entrega, options) => {
  // A chave 'entregas_nome' será acessada como 'entregasNome' no código, graças ao underscored.
  if (entrega.entregas_nome) {
    entrega.entregas_nome = entrega.entregas_nome.toUpperCase();
  }
});
entregas.beforeUpdate((entrega, options) => {
  // A chave 'entregas_nome' será acessada como 'entregasNome' no código, graças ao underscored.
  if (entrega.entregas_nome) {
    entrega.entregas_nome = entrega.entregas_nome.toUpperCase();
  }
});

entregas.belongsTo(veiculos);
entregas.belongsTo(telefone);
entregas.belongsTo(documentos);

//entregas.sync({ force: true });

module.exports = entregas;
