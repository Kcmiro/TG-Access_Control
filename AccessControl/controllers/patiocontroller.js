const express = require("express");
const { where, Model } = require("sequelize");
const { Op } = require("sequelize");

const Patio = require("../models/registro_patio");
const Bicicletas = require("../models/bicicletario");
const Entregas = require("../models/entregas");
const Servico = require("../models/servicos");
const Chave = require("../models/registro_chave");
const Usuario = require("../models/usuario");
const Lojas = require("../models/lojas");

exports.mostrarPatio((req, res, next) => {
  res.render("index");
});

exports.patioEntregas((req, res, next) => {
  const id = req.params.id;
  const patio_horaentrada = req.body.patio_horaentrada;
  const entregaId = req.body.entregaId;
  const usuarioId = req.body.usuarioId;
  const lojaNome = req.body.lojaNome;

  Lojas.create({ lojaNome: lojaNome })
    .then(([patio]) => {
      return Patio.create(
        {
          patio_horaentrada: patio_horaentrada,
          entregaId: entregaId,
          usuarioId: usuarioId,
        },
        {
          where: { id: id },
        }
      ).then((entradaPatio) => {
        return res.redirect("/entregas/entregascadastro");
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("entregasregistro", { msg: "Erro ao atualizar a bicicleta." });
    });
});



exports.patioServicos((req, res, next) => {});
