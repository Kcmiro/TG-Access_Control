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
});

servico.belongsTo(Veiculo);
servico.belongsTo(Telefone);
servico.belongsTo(Documento);

//servico.sync({ force: true });

module.exports = servico;
