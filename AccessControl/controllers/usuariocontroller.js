const express = require("express");
const bcrypt = require("bcryptjs");

const usuario = require("../models/usuario");
const { where } = require("sequelize");

exports.mostrarCadastro = (req, res, next) => {
  res.render("cadastrousuario", { msg: "" });
};
exports.create = (req, res, next) => {
  const nome = req.body.nome;
  const senha = req.body.senha;
  const nivel = req.body.nivel;

  if (nome == "" || senha == "") {
    res.render("cadastrousuario", { msg: "Preencha todos os campos" });
  } else {
    let salt = bcrypt.genSaltSync(10);
    let senhacriptografada = bcrypt.hashSync(senha, salt);
    usuario
      .findOne({
        where: {
          usuario_nome: nome,
        },
      })
      .then((Usuario) => {
        if (Usuario == undefined) {
          usuario
            .create({
              usuario_nome: nome,
              usuario_senha: senhacriptografada,
              usuario_nivel: nivel,
            })
            .then((resultado) => {
              res.render("cadastrousuario", { msg: "" });
            })
            .catch((err) => {
              console.log(err);
              res.render("cadastrousuario", { msg: err });
            });
        } else {
          res.render("cadastrousuario", { msg: "USUARIO JÁ CADASTRADO!!!" });
        }
      });
  }
};

exports.login = (req, res, next) => {
  var nome = req.body.nome;
  var senha = req.body.senha;

  usuario
    .findOne({
      where: {
        usuario_nome: nome,
      },
    })
    .then((Usuario) => {
      if (Usuario != undefined) {
        let usuario_logado = bcrypt.compareSync(senha, Usuario.usuario_senha);

        if (usuario_logado) {
          req.session.Usuario = {
            id: Usuario.id,
            nome: Usuario.usuario_nome,
            nivel: Usuario.usuario_nivel,
          };
          res.redirect("/patio/patio");
        } else {
          res.render("login", { msg: "USUARIO OU SENHA INVALIDO" });
        }
      } else {
        res.render("login", { msg: "USUARIO OU SENHA INVALIDO" });
      }
    });
};

exports.mostrarlogin = (req, res, next) => {
  res.render("login", { msg: "" });
};

exports.mostrarAlterarSenha = (req, res, next) => {
  res.render("perfil", { msg: "" });
};

exports.alterarSenha = (req, res, next) => {
  const { senha_atual, nova_senha, confirmar_senha } = req.body;

  // Verifica se a nova senha e a confirmação são iguais
  if (nova_senha !== confirmar_senha) {
    return res.render("perfil", { msg: "As senhas não coincidem." });
  }

  // Verifica se o usuário está logado
  const usuarioId = req.session.Usuario ? req.session.Usuario.id : null;
  if (!usuarioId) {
    return res.redirect("/login");
  }

  // Busca o usuário no banco de dados usando o ID da sessão
  usuario
    .findByPk(usuarioId)
    .then((user) => {
      if (!user) {
        return res.render("perfil", { msg: "Usuário não encontrado." });
      }

      // Verifica se a senha atual fornecida está correta
      bcrypt.compare(senha_atual, user.usuario_senha, (err, result) => {
        if (err) {
          return res.render("perfil", {
            msg: "Erro ao verificar senha.",
          });
        }

        if (!result) {
          return res.render("perfil", { msg: "Senha atual incorreta." });
        }

        // Criptografa a nova senha
        bcrypt.hash(nova_senha, 10, (err, hashedSenha) => {
          if (err) {
            return res.render("perfil", {
              msg: "Erro ao criptografar a nova senha.",
            });
          }

          // Atualiza a senha no banco de dados
          user.usuario_senha = hashedSenha;
          user
            .save()
            .then(() => {
              res.render("perfil", {
                msg: "Senha alterada com sucesso!",
              });
            })
            .catch((error) => {
              res.render("perfil", {
                msg: "Erro ao salvar a nova senha.",
              });
            });
        });
      });
    })
    .catch((error) => {
      res.render("perfil", { msg: "Erro ao buscar usuário." });
    });
};

exports.listarUsuarios = (req, res, next) => {
  // Buscar todos os usuários no banco de dados
  usuario
    .findAll()
    .then((usuarios) => {
      res.render("editarusuarios", { usuarios: usuarios, msg: "" });
    })
    .catch((err) => {
      console.log(err);
      res.render("editarusuarios", {
        usuarios: [],
        msg: "Erro ao buscar usuários.",
      });
    });
};

exports.excluirUsuario = (req, res, next) => {
  const usuarioId = req.params.id;

  // Excluir o usuário com o ID especificado
  usuario
    .destroy({
      where: { id: usuarioId },
    })
    .then(() => {
      res.redirect("/usuario/editarusuarios");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/usuario/editarusuarios");
    });
};
