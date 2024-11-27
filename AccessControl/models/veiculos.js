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

veiculos.beforeCreate((veiculos, options) => {
  if (veiculos.veiculos_placa) {
    veiculos.veiculos_placa = veiculos.veiculos_placa.replace(
      /[^A-Za-z0-9]/g,
      ""
    );

    veiculos.veiculos_placa = veiculos.veiculos_placa.toUpperCase();
    veiculos.veiculos_modelo = veiculos.veiculos_modelo.toUpperCase();
  }
});

veiculos.beforeUpdate((veiculos, options) => {
  // Remove qualquer formatação do CPF
  if (veiculos.veiculos_placa) {
    veiculos.veiculos_placa = veiculos.veiculos_placa.replace(
      /[^A-Za-z0-9]/g,
      ""
    );
    veiculos.veiculos_placa = veiculos.veiculos_placa.toUpperCase();
    veiculos.veiculos_modelo = veiculos.veiculos_modelo.toUpperCase();
  }
});

module.exports = veiculos;
