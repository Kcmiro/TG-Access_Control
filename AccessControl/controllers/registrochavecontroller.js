const express = require("express");
const registro_chave = require("../models/registro_chave");
const { where } = require("sequelize");

exports.mostrarRChaves = (req, res, next) => {
  res.render("registrochavecadastro", { msg: "" });
};

exports.create = (req, res, next) => {
  const id = req.body.id;
  const chave_id = req.body.chave_id;
  const rchave_nome = req.body.rchave_nome;
  const rchave_telefone = req.body.rchave_telefone;
  const rchave_motivo = req.body.rchave_motivo;
  const rchave_observacao = req.body.rchave_observacao;

  // Verifica se os campos estão preenchidos
  if (!chave_id || !rchave_nome || !rchave_motivo || !rchave_observacao) {
    return res.render("registrochavecadastro", {
      msg: "PREENCHA TODOS OS CAMPOS",
    });
  } else {
    chaves
      .findOne({
        where: {
          id: id,
        },
      })
      .then((rchave) => {
        // Verifica se a chave já existe
        if (!rchave) {
          registro_chave
            .create({
              rchave_nome: rchave_nome,
              rchave_telefone: rchave_telefone,
              rchave_motivo: rchave_motivo,
              rchave_observacao: rchave_observacao,
              chave_id: chave_id,
            })
            .then((rchavecriado) => {
              // Caso a chave seja criada com sucesso, renderiza com mensagem de sucesso
              res.render("registrochavecadastro", {
                msg: "REGISTRO REALIZADO",
                rchavecriado: rchavecriado,
              });
            })
            .catch((err) => {
              console.log(err);
              // Caso ocorra um erro na criação, renderiza com a mensagem de erro
              res.render("registrochavecadastro", {
                msg: "Erro no cadastro da chave",
              });
            });
        }
      })
      .catch((err) => {
        // Erro no findOne
        console.log(err);
        res.render("registrochavecadastro", { msg: "Erro ao buscar registro" });
      });
  }
};
