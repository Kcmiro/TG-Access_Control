const express = require("express");
const registro_chave = require("../models/registro_chave");
const chaves = require("../models/chaves");
const { where } = require("sequelize");

exports.mostrarRChaves = (req, res, next) => {
  res.render("registrochavecadastro", { msg: "" });
};

exports.create = (req, res, next) => {
  const {
    id,
    chave_id,
    rchave_nome,
    rchave_telefone,
    rchave_motivo,
    rchave_observacao,
  } = req.body;

  // Verifica se os campos obrigatórios estão preenchidos
  if (!chave_id || !rchave_nome || !rchave_motivo || !rchave_observacao) {
    return res.render("registrochavecadastro", {
      msg: "PREENCHA TODOS OS CAMPOS",
    });
  }

  // Verifica se o chave_id já existe
  chaves
    .findOne({
      where: {
        chave_id: chave_id, // Procura pelo chave_id
      },
    })
    .then((chave) => {
      if (!chave) {
        // Se não encontrar o chave_id, exibe mensagem de erro
        return res.render("registrochavecadastro", {
          msg: "CHAVE NÃO ENCONTRADA",
        });
      } else {
        // Se o chave_id existir, permite a criação do registro
        registro_chave
          .create({
            rchave_nome: rchave_nome,
            rchave_telefone: rchave_telefone,
            rchave_motivo: rchave_motivo,
            rchave_observacao: rchave_observacao,
            chave_id: chave_id,
          })
          .then((rchavecriado) => {
            // Caso o registro seja criado com sucesso
            res.render("registrochavecadastro", {
              msg: "REGISTRO REALIZADO COM SUCESSO",
              rchavecriado: rchavecriado,
            });
          })
          .catch((err) => {
            // Caso ocorra um erro na criação do registro
            console.error(err);
            res.render("registrochavecadastro", {
              msg: "Erro ao criar o registro da chave",
            });
          });
      }
    })
    .catch((err) => {
      // Caso ocorra um erro ao buscar o chave_id
      console.error(err);
      res.render("registrochavecadastro", { msg: "Erro ao buscar a chave" });
    });
};
