const Sequelize = require("sequelize");
const connection = require("../database/database");

const Documento = require("../models/documentos");
const Veiculo = require("../models/veiculos");
const Telefone = require("../models/telefone");

const servico = connection.define("servico", {
  servico_nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  servico_descricao: {
    type: Sequelize.TEXT("long"),
    allowNull: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "servicos",
    validate: {
      isIn: [["servicos"]],
    },
  },
});

servico.beforeCreate((servicos, options) => {
  // A chave 'entregas_nome' será acessada como 'entregasNome' no código, graças ao underscored.
  if (servicos.servico_nome) {
    servicos.servico_nome = servicos.servico_nome.toUpperCase();
  }
});

servico.beforeUpdate((servicos, options) => {
  // A chave 'entregas_nome' será acessada como 'entregasNome' no código, graças ao underscored.
  if (servicos.servico_nome) {
    servicos.servico_nome = servicos.servico_nome.toUpperCase();
  }
});
servico.belongsTo(Veiculo);
servico.belongsTo(Telefone);
servico.belongsTo(Documento);

//servico.sync({ force: true });

module.exports = servico;
