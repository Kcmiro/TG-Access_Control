const express = require("express");
const Entregas = require("../models/entregas");
const Veiculos = require("../models/veiculos");
const Documentos = require("../models/documentos");
const Telefones = require("../models/telefone");
const { where } = require("sequelize");
const entregas = require("../models/entregas");

exports.mostrarEntregas = (req, res, next) => {
  res.render("entregascadastro", { msg: "" });
};

exports.create = (req, res, next) => {
  const entregas_nome = req.body.entregas_nome;
  const veiculos_placa = req.body.veiculos_placa;
  const veiculos_modelo = req.body.veiculos_modelo;
  const telefone = req.body.telefone;
  const doc_cnh = req.body.doc_cnh;
  const doc_cpf = req.body.doc_cpf;
  const doc_empresa = req.body.doc_empresa;

  // Verificando se todos os campos foram preenchidos
  if (
    !entregas_nome ||
    !veiculos_placa ||
    !veiculos_modelo ||
    !telefone ||
    !doc_cnh ||
    !doc_cpf ||
    !doc_empresa
  ) {
    return res.render("entregas", { msg: "Preencha todos os campos" });
  }

  // Verificando duplicidade antes de criar
  Promise.all([
    Veiculos.findOne({ where: { veiculos_placa: veiculos_placa } }), // Verifica placa
    Telefones.findOne({ where: { telefone: telefone } }), // Verifica telefone
    Documentos.findOne({ where: { doc_cnh: doc_cnh } }), // Verifica CNH
    Documentos.findOne({ where: { doc_cpf: doc_cpf } }), // Verifica CPF
  ])
    .then(
      ([veiculoExistente, telefoneExistente, cnhExistente, cpfExistente]) => {
        if (veiculoExistente) {
          return res.render("entregas", {
            msg: "Placa de veículo já cadastrada",
          });
        }
        if (telefoneExistente) {
          return res.render("entregas", { msg: "Telefone já cadastrado" });
        }
        if (cnhExistente) {
          return res.render("entregas", { msg: "CNH já cadastrada" });
        }
        if (cpfExistente) {
          return res.render("entregas", { msg: "CPF já cadastrado" });
        }

        // Se não houver duplicidade, cria o veiculo, telefone, documento e entrega
        Veiculos.create({
          veiculos_placa: veiculos_placa,
          veiculos_modelo: veiculos_modelo,
        })
          .then((veiculo) => {
            return Telefones.create({
              telefone: telefone,
            }).then((tel) => {
              return Documentos.create({
                doc_cnh: doc_cnh,
                doc_cpf: doc_cpf,
                doc_empresa: doc_empresa,
              }).then((doc) => {
                // Agora, cria a entrega com as chaves estrangeiras
                return Entregas.create({
                  entregas_nome: entregas_nome,
                  veiculoId: veiculo.id, // Referência para o veiculo
                  telefoneId: tel.id, // Referência para o telefone
                  documentoId: doc.id, // Referência para o documento
                });
              });
            });
          })
          .then((entregaCriada) => {
            res.render("entregas", {
              msg: "Entrega cadastrada com sucesso",
              entrega: entregaCriada,
            });
          })
          .catch((err) => {
            console.log(err);
            res.render("entregas", { msg: "Erro ao cadastrar entrega" });
          });
      }
    )
    .catch((err) => {
      console.log(err);
      res.render("entregas", { msg: "Erro ao verificar dados de duplicidade" });
    });
};

exports.update = (req, res, next) => {
  const id = req.body.id;
  const entregas_nome = req.body.entregas_nome;
  const veiculos_placa = req.body.veiculos_placa;
  const veiculos_modelo = req.body.veiculos_placa;
  const telefone = req.body.telefone;
  const doc_cnh = req.body.doc_cnh;
  const doc_cpf = req.body.doc_cpf;
  const doc_empresa = req.body.doc_empresa;

  if (
    !entregas_nome ||
    !veiculos_placa ||
    !veiculos_modelo ||
    !telefone ||
    !doc_cnh ||
    !doc_cpf ||
    !doc_empresa
  ) {
    res.render("entregas", { msg: "Preencha todos os campos" });
  }
  Entregas.findOne({
    where: {
      [Sequelize.Op.or]: [
        { veiculos_placa: veiculos_placa },
        { telefone: telefone },
        { doc_cnh: doc_cnh },
        { doc_cpf: doc_cpf },
      ],
    },
  }).then((entregaExistente) => {
    if (entregaExistente) {
      if (entregaExistente.veiculos_placa === veiculos_placa) {
        return res.render("entregas", { msg: "Placa já existe" });
      }
      if (entregaExistente.telefone === telefone) {
        return res.render("entregas", { msg: "Telefone já existe" });
      }
      if (entregaExistente.doc_cnh === doc_cnh) {
        return res.render("entregas", { msg: "CNH já existe" });
      }
      if (entregaExistente.doc_cpf === doc_cpf) {
        return res.render("entregas", { msg: "CPF já existe" });
      }
    }
  });

  Entregas.update(
    {
      entregas_nome: entregas_nome,
      veiculos_placa: veiculos_placa,
      veiculos_modelo: veiculos_modelo,
      telefone: telefone,
      doc_cnh: doc_cnh,
      doc_cpf: doc_cpf,
      doc_empresa: doc_empresa,
    },
    {
      where: {
        id: id,
      },
    }
      .then((resultado) => {
        res.render("entregas", {
          msg: "Entrega alterada",
        });
      })
      .catch((err) => {
        console.log(err);
        res.render("entregas", { msg: "Erro na Alteração de Entregas" });
      })
  );
};

exports.delete = (req, res, next) => {
  const id = req.body.id;

  Entregas.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.render("entregas", {
        msg: "Entregador excluída",
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("entregas", {
        msg: "Erro na exclusão do Entregador",
      });
    });
};

exports.getOne = (req, res, next) => {
  const id = req.params.id;

  Entregas.findByPk(id).then((entregas) => {
    res.render({
      mensagem: "Entregador encontrada",
      entregas: entregas,
    });
  });
};

exports.getAll = (req, res, next) => {
  Entregas.findAll({
    order: [["entregas_nome", "ASC"]],
    attributes: ["id", "entregas_nome"],
    include: [
      {
        model: Veiculos,
        require: true,
        attributes: ["veiculos_placa", "veiculos_modelo"],
      },
    ],
    include: [
      {
        model: Documentos,
        require: true,
        attributes: ["doc_cnh", "doc_cpf", "doc_empresa"],
      },
    ],
    include: [
      {
        model: Telefones,
        require: true,
        attributes: ["telefone"],
      },
    ],
  }).then((entregas) => res.render("entregas", { msg: "Entregas Encontrada" }));
};
