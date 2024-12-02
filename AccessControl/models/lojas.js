const Sequelize = require("sequelize");
const connection = require("../database/database");

const lojas = connection.define("lojas", {
  lojaNome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
lojas.beforeCreate((lojas, options) => {
  // A chave 'entregas_nome' será acessada como 'entregasNome' no código, graças ao underscored.
  if (lojas.lojaNome) {
    lojas.lojaNome = lojas.lojaNome.toUpperCase();
  }
});

lojas.beforeUpdate((lojas, options) => {
  // A chave 'entregas_nome' será acessada como 'entregasNome' no código, graças ao underscored.
  if (lojas.lojaNome) {
    lojas.lojaNome = lojas.lojaNome.toUpperCase();
  }
});
//lojas.sync({});
//lojas.sync({ force: true });
module.exports = lojas;
