const express = require("express");
const chaves = require("../models/chaves");
const { where } = require("sequelize");

exports.mostrarChaves = (req, res, next) => {
  res.render("chavescadastro", { msg: "" });
};

exports.create = (req, res, next) => {
  const chave_id = req.body.chave_id;
  const chave_nome = req.body.chave_nome;

  // Verifica se os campos estão preenchidos
  if (!chave_id || !chave_nome) {
    return res.render("chavescadastro", { msg: "PREENCHA TODOS OS CAMPOS" });
  } else {
    chaves
      .findOne({
        where: {
          chave_id: chave_id,
        },
      })
      .then((Chave) => {
        // Verifica se a chave já existe
        if (!Chave) {
          chaves
            .create({
              chave_id: chave_id,
              chave_nome: chave_nome,
            })
            .then((chavecriado) => {
              // Caso a chave seja criada com sucesso, renderiza com mensagem de sucesso
              res.render("chavescadastro", {
                msg: "CHAVE CADASTRADA",
                Chave: {
                  chave_id: chavecriado.chave_id,
                  chave_nome: chavecriado.chave_nome,
                },
              });
            })
            .catch((err) => {
              console.log(err);
              // Caso ocorra um erro na criação, renderiza com a mensagem de erro
              res.render("chavescadastro", {
                msg: "Erro no cadastro da chave",
              });
            });
        } else {
          // Caso a chave já exista, renderiza com mensagem de chave já existente
          res.render("chavescadastro", { msg: "Chave já existe!" });
        }
      })
      .catch((err) => {
        // Erro no findOne
        console.log(err);
        res.render("chavescadastro", { msg: "Erro ao buscar a chave" });
      });
  }
};

exports.update = (req, res, next) => {
  const chave_id = req.body.chave_id;
  const chave_nome = req.body.chave_nome;

  if (!chave_id || !chave_nome) {
    return res.render("chavescadastro", { msg: "PREENCHA TODOS OS CAMPOS" });
  } else {
    chaves
      .findOne({
        where: {
          chave_id: chave_id,
        },
      })
      .then((Chave) => {
        if (Chave == undefined) {
          chaves
            .update({
              chave_id: chave_id,
              chave_nome: chave_nome,
            })
            .then((chavecriado) => {
              res.render("chavescadastro", {
                msg: "CHAVE ATUALIZADA",
                Chave: {
                  chave_id: chavecriado.chave_id,
                  chave_nome: chavecriado.chave_nome,
                },
              });
            })
            .catch((err) => {
              console.log(err);
              res.render("cadastrochaves", {
                msg: "Erro no cadastro da chave",
              });
            });
        } else {
          res.render("cadastrochave", { msg: "Chave já existe!" });
        }
      });
  }
};

exports.delete = (req, res, next) => {
  const chave_id = req.body.chave_id;

  chaves
    .destroy({
      where: {
        chave_id: chave_id,
      },
    })
    .then(() => {
      res.render("chavescadastro", {
        mensagem: "Chave excluído",
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("cadastrochave", {
        mensagem: "Erro na exclusão de Chave",
      });
    });
};

exports.getOne = (req, res, next) => {
  const chave_id = req.params.chave_id;

  chaves
    .findOne({
      where: {
        chave_id: chave_id,
      },
      attributes: ["chave_id", "chave_nome"],
    })
    .then((chave) => {
      res.render("chavescadastro", {
        mensagem: "Tipo encontrado",
        chave: chave,
      });
    });
};

exports.getAll = (req, res, next) => {
  chaves
    .findAll({
      order: [["chave_id", "ASC"]],
      attributes: ["chave_id", "chave_nome"],
    })
    .then((chaves) => {
      res.status(200).json({
        mensagem: "Tipos encontrados",
        chaves: chaves,
      });
    });
};
