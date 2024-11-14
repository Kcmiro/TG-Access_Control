const express = require("express");
const chaves = require("../models/chaves");

exports.create = (req, res, next) => {
  const chave_id = req.body.chave_id;
  const chave_nome = req.body.chave_nome;

  if (!chave_id || !chave_nome) {
    return res.render("chaves", { msg: "PREENCHA TODOS OS CAMPOS" });
  }

  Promise.all([chaves.FindOne({ where: { chave_id: chave_id } })]).then([
    chaveExis,
  ]);
};
