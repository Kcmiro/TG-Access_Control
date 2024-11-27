const express = require("express");
const chaves = require("../models/chaves");
const { where } = require("sequelize");
const { Op } = require("sequelize");

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

// Controlador para editar (atualizar) a chave
exports.update = (req, res, next) => {
  const chave_id = req.params.id;
  const chave_nome = req.body.chave_nome;

  // Atualiza a chave no banco de dados
  chaves
    .update({ chave_nome: chave_nome }, { where: { chave_id: chave_id } })
    .then(() => {
      res.redirect("/chaves/listarchaves"); // Redireciona para a lista de chaves
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/chaves/listarchaves"); // Em caso de erro, redireciona de volta
    });
};

exports.delete = (req, res, next) => {
  const chave_id = req.params.id; // A chave_id vem da URL

  console.log("Tentando excluir chave com ID:", chave_id);

  if (!chave_id) {
    console.log("Erro: ID não fornecido");
    return res.render("chavescadastro", {
      mensagem: "Erro: ID de chave não fornecido",
    });
  }

  chaves
    .destroy({
      where: { chave_id: chave_id }, // Apaga a chave com o chave_id fornecido
    })
    .then(() => {
      console.log("Chave excluída com sucesso");
      res.redirect("/chaves/listarchaves"); // Redireciona para a lista de chaves
    })
    .catch((err) => {
      console.log("Erro ao excluir chave:", err);
      res.render("listarchaves", {
        mensagem: "Erro na exclusão de Chave",
      });
    });
};

exports.getOne = (req, res, next) => {
  const chave_id = req.params.id;
  chaves
    .findOne({
      where: { chave_id: chave_id },
      attributes: ["chave_id", "chave_nome"],
    })
    .then((chave) => {
      if (!chave) {
        return res.redirect("/chaves/listarchaves");
      }
      res.render("editarchaves", { chave: chave });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/chaves/listarchaves");
    });
};

exports.getAll = (req, res, next) => {
  const query = req.query.query || ""; // Pega o valor da pesquisa (caso exista)

  let whereCondition = {
    [Op.or]: [
      { chave_id: { [Op.like]: `%${query}%` } }, // Pesquisa por nome
      { chave_nome: { [Op.like]: `%${query}%` } }, // Pesquisa por loja
    ],
  };
  chaves
    .findAll({
      where: whereCondition,
      order: [["chave_id", "ASC"]],
      attributes: ["chave_id", "chave_nome"],
    })
    .then((chaves) => {
      res.render("listarchaves", {
        mensagem: "Tipos encontrados",
        chaves: chaves,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("listarchaves", { mensagem: "Erro ao carregar as chaves." });
    });
};
