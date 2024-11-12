const Sequelize = require("sequelize");
const connection = require("../database/database");

const veiculos = connection.define("veiculos", {
  veiculos_placa: {
    type: Sequelize.CHAR(7),
    allowNull: false,
    unique: true,
  },
  veiculos_modelo: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
});

//veiculos.sync({ force: true });

module.exports = veiculos;
