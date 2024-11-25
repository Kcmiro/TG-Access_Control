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
              res.render("login", { msg: "" });
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
          res.redirect("/");
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
