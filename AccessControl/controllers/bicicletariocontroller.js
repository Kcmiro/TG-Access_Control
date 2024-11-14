const express = require("express");
const Bicicletas = require("../models/bicicletario");
const Telefone = require("../models/telefone");
const { where, Model } = require("sequelize");
const bicicletario = require("../models/bicicletario");

exports.create = (req, res, next) => {
  const bike_nome = req.body.bike_nome;
  const bike_cor = req.body.bike_cor;
  const bike_loja = req.body.bike_loja;
  const telefone = req.bosy.telefone;

  if (!bike_nome || !bike_cor || !telefone) {
    return res.render("bicicletario", { msg: "Preecha todos os campos" });
  }

  Promise.all([Telefone.findOne({ where: { telefone: telefone } })])
    .then(([telefoneexistente]) => {
      return Promise.all([
        telefoneexistente ||
          Telefone.create({
            telefone: telefone,
          }),
      ]);
    })
    .then(([tel]) => {
      return Bicicletas.create({
        bike_nome: bike_nome,
        bike_cor: bike_cor,
        bike_loja: bike_loja,
        telefoneID: tel.id,
      });
    })
    .then((bicicletacriado) => {
      res.render("bicicletario", {
        msg: "BIKE CADASTRADO COM SUCESSO",
        bicicletario: bicicletacriado,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("bicicletario", { msg: "ERRO NO CADASTRO DO BICICLETÁRIO" });
    });
};

exports.update = (req, res, next) => {
  const id = req.body.id;
  const bike_nome = req.body.bike_nome;
  const bike_cor = req.body.bike_cor;
  const bike_loja = req.body.bike_loja;
  const telefone = req.bosy.telefone;

  if (!bike_nome || !bike_cor || !telefone) {
    return res.render("bicicletario", { msg: "Preecha todos os campos" });
  }

  Promise.all([Telefone.findOne({ where: { telefone: telefone } })])
    .then(([telefoneexistente]) => {
      return Promise.all([
        telefoneexistente ||
          Telefone.update({
            telefone: telefone,
          }),
      ]);
    })
    .then(([tel]) => {
      return Bicicletas.update(
        {
          bike_nome: bike_nome,
          bike_cor: bike_cor,
          bike_loja: bike_loja,
          telefoneID: tel.id,
        },
        {
          where: {
            id: id,
          },
        }
      );
    })
    .then((bicicletaatualizado) => {
      res.render("bicicletario", {
        msg: "BIKE ATUALIZADO COM SUCESSO",
        bicicletario: bicicletaatualizado,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("bicicletario", { msg: "ERRO AO ATUALIZAR O BICICLETÁRIO" });
    });
};

exports.delete = (req, res, next) => {
  const id = req.body.id;

  Bicicletas.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.render("bicicletario", {
        msg: "servicos excluída",
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("bicicletario", {
        msg: "Erro na exclusão do Entregador",
      });
    });
};

exports.getOne = (req, res, next) => {
  const id = req.params.id;

  Bicicletas.findByPk(id).then((bicicletario) => {
    res.render("bicicletario", {
      msg: "BIKE ENCONTRADA ",
      bicicletario: bicicletario,
    });
  });
};

exports.getAll = (req, res, next) => {
  Bicicletas.findAll({
    order: [["bike_nome", "ASC"]],
    attibutes: ["id", "bike_nome", "bike_cor", "bike_loja"],
    include: [
      {
        model: Telefone,
        require: true,
        attibutes: ["telefone"],
      },
    ],
  })
    .then((bicicletario) =>
      res.render("bicicletario", {
        msg: "Bicicletas Encontradas",
        bicicletario: bicicletario,
      })
    )
    .catch((err) => {
      console.log(err);
      res.render("bicicletario", { msg: "ERRO AO BUSCAR BICICLETÁRIO" });
    });
};
