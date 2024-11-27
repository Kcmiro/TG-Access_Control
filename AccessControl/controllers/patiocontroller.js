const express = require("express");
const { where, Model } = require("sequelize");

const Bicicletas = require("../models/bicicletario");
const Entregas = require("../models/entregas");
const Servico = require("../models/servicos");
const Chave = require("../models/registro_chave");

exports.mostrarPatio((req, res, next) => {
  res.render("patio");
});

const { Op } = require("sequelize");
