const Sequelize = require("sequelize");
const connection = require("../database/database");
const telefone = require("../models/telefone");
const { toDefaultValue } = require("sequelize/lib/utils");

const bicicletario = connection.define("bicicletario", {
  bike_nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bike_cor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bike_loja: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "bike",
    validate: {
      isIn: [["bike"]],
    },
  },
});

bicicletario.beforeCreate((bike, options) => {
  if (bike.bike_nome) {
    bike.bike_nome = bike.bike_nome.toUpperCase();
  }
  if (bike.bike_cor) {
    bike.bike_cor = bike.bike_cor.toUpperCase();
  }
  if (bike.bike_loja) {
    bike.bike_loja = bike.bike_loja.toUpperCase();
  }
});

bicicletario.beforeUpdate((bike, options) => {
  if (bike.bike_nome) {
    bike.bike_nome = bike.bike_nome.toUpperCase();
  }
  if (bike.bike_cor) {
    bike.bike_cor = bike.bike_cor.toUpperCase();
  }
  if (bike.bike_loja) {
    bike.bike_loja = bike.bike_loja.toUpperCase();
  }
});
bicicletario.belongsTo(telefone);

//bicicletario.sync({ force: true });

module.exports = bicicletario;
