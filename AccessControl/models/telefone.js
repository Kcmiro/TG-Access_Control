const Sequelize = require("sequelize");
const connection = require("../database/database");

const telefones = connection.define("telefones", {
  telefone: {
    type: Sequelize.STRING(15),
    allowNull: false,
    unique: true,
  },
});

//telefones.sync({ force: true });

module.exports = telefones;
