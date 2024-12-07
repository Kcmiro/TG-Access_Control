const Sequelize = require("sequelize");
const connection = require("../database/database");
const saltRounds = 10;
const bcrypt = require("bcryptjs");

const usuario = connection.define("usuario", {
  usuario_nome: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  usuario_senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  usuario_nivel: {
    type: Sequelize.ENUM("OPERADOR", "ADM", "CFTV"),
    allowNull: false,
  },
});

function criarUsuarioPadrao() {
  usuario
    .count()
    .then((usuarioCount) => {
      if (usuarioCount === 0) {
        return bcrypt
          .hash("Terral@2024", saltRounds) // Criptografa a senha
          .then((hashedSenha) => {
            return usuario.create({
              usuario_nome: "TerralADM",
              usuario_senha: hashedSenha, // Senha criptografada
              usuario_nivel: "ADM",
            });
          });
      }
    })
    .then(() => {
      console.log("Usuário padrão criado com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao criar o usuário padrão:", error);
    });
}

criarUsuarioPadrao();

//usuario.sync({force: true});

module.exports = usuario;
