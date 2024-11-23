const express = require("express");
const Servicos = require("../models/servicos");
const Veiculos = require("../models/veiculos");
const Documentos = require("../models/documentos");
const Telefones = require("../models/telefone");
const { where } = require("sequelize");

exports.mostrarServicos = (req, res, next) => {
  res.render("servicoscadastro", { msg: "" });
};
exports.create = (req, res, next) => {
  const servico_nome = req.body.servico_nome;
  const servico_descricao = req.body.servico_descricao;
  const veiculos_placa = req.body.veiculos_placa;
  const veiculos_modelo = req.body.veiculos_modelo;
  const telefone = req.body.telefone;
  const doc_cnh = req.body.doc_cnh;
  const doc_cpf = req.body.doc_cpf;
  const doc_empresa = req.body.doc_empresa;

  // Verificando se todos os campos foram preenchidos
  if (
    !servico_nome ||
    !veiculos_placa ||
    !veiculos_modelo ||
    !telefone ||
    !doc_cnh ||
    !doc_cpf ||
    !doc_empresa
  ) {
    return res.render("servicoscadastro", { msg: "Preencha todos os campos" });
  }

  // Verificando duplicidade antes de criar (agora verificando somente a combinação do serviço)
  Promise.all([
    Veiculos.findOne({ where: { veiculos_placa: veiculos_placa } }), // Verifica placa
    Telefones.findOne({ where: { telefone: telefone } }), // Verifica telefone
    Documentos.findOne({ where: { doc_cnh: doc_cnh } }), // Verifica CNH
    Documentos.findOne({ where: { doc_cpf: doc_cpf } }), // Verifica CPF
  ])
    .then(([veiculoExistente, telefoneExistente, docExistente]) => {
      // Se não houver duplicidade, cria o veiculo, telefone, documento e serviço
      return Promise.all([
        // Cria os registros se não existirem
        veiculoExistente ||
          Veiculos.create({
            veiculos_placa: veiculos_placa,
            veiculos_modelo: veiculos_modelo,
          }),
        telefoneExistente ||
          Telefones.create({
            telefone: telefone,
          }),
        docExistente ||
          Documentos.create({
            doc_cnh: doc_cnh,
            doc_cpf: doc_cpf,
            doc_empresa: doc_empresa,
          }),
      ]);
    })
    .then(([veiculo, tel, doc]) => {
      // Agora cria o serviço com as chaves estrangeiras
      return Servicos.create({
        servico_nome: servico_nome,
        servico_descricao: servico_descricao,
        veiculoId: veiculo.id, // Referência para o veiculo
        telefoneId: tel.id, // Referência para o telefone
        documentoId: doc.id, // Referência para o documento
      });
    })
    .then((servicocriado) => {
      res.render("servicoscadastro", {
        msg: "Servico cadastrada com sucesso",
        servico: servicocriado,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("servicoscadastro", { msg: "Erro ao cadastrar Servico" });
    });
};

exports.update = (req, res, next) => {
  const id = req.body.id;
  const servico_nome = req.body.servico_nome;
  const servico_descricao = req.body.servico_descricao;
  const veiculos_placa = req.body.veiculos_placa;
  const veiculos_modelo = req.body.veiculos_modelo;
  const telefone = req.body.telefone;
  const doc_cnh = req.body.doc_cnh;
  const doc_cpf = req.body.doc_cpf;
  const doc_empresa = req.body.doc_empresa;

  // Verificando se todos os campos foram preenchidos
  if (
    !servico_nome ||
    !veiculos_placa ||
    !veiculos_modelo ||
    !telefone ||
    !doc_cnh ||
    !doc_cpf ||
    !doc_empresa
  ) {
    return res.render("servicos", { msg: "Preencha todos os campos" });
  }

  Promise.all([
    Veiculos.findOne({ where: { veiculos_placa: veiculos_placa } }), // Verifica placa
    Telefones.findOne({ where: { telefone: telefone } }), // Verifica telefone
    Documentos.findOne({ where: { doc_cnh: doc_cnh } }), // Verifica CNH
    Documentos.findOne({ where: { doc_cpf: doc_cpf } }), // Verifica CPF
  ]).then(
    ([veiculoExistente, telefoneExistente, cnhExistente, cpfExistente]) => {
      if (veiculoExistente) {
        return res.render("servicos", {
          msg: "Placa de veículo já cadastrada",
        });
      }
      if (telefoneExistente) {
        return res.render("servicos", { msg: "Telefone já cadastrado" });
      }
      if (cnhExistente) {
        return res.render("servicos", { msg: "CNH já cadastrada" });
      }
      if (cpfExistente) {
        return res.render("servicos", { msg: "CPF já cadastrado" });
      }
    }
  );

  Veiculos.update({
    veiculos_placa: veiculos_placa,
    veiculos_modelo: veiculos_modelo,
  })
    .then((veiculo) => {
      return Telefones.update({
        telefone: telefone,
      }).then((tel) => {
        return Documentos.update({
          doc_cnh: doc_cnh,
          doc_cpf: doc_cpf,
          doc_empresa: doc_empresa,
        }).then((doc) => {
          // Agora, cria a entrega com as chaves estrangeiras
          return Servicos.update(
            {
              servico_nome: servico_nome,
              servico_descricao: servico_descricao,
              veiculoId: veiculo.id, // Referência para o veiculo
              telefoneId: tel.id, // Referência para o telefone
              documentoId: doc.id, // Referência para o documento
            },
            {
              where: {
                id: id,
              },
            }
          );
        });
      });
    })
    .then((servicoatualizado) => {
      res.render("servicos", {
        msg: "Servico Atualizado com sucesso",
        servico: servicoatualizado,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("servicos", { msg: "Erro ao atualizar Servico" });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;
  Servicos.destroy({ where: { id: id } })
    .then(() => {
      res.redirect("/servicos");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/servicos");
    });
};

exports.getOne = (req, res, next) => {
  const id = req.params.id;
  Servicos.findByPk(id, {
    include: [
      { model: Veiculos, attributes: ["veiculos_placa", "veiculos_modelo"] },
      { model: Telefones, attributes: ["telefone"] },
      { model: Documentos, attributes: ["doc_cnh", "doc_cpf", "doc_empresa"] },
    ],
  })
    .then((servico) => {
      res.render("editarServico", { servico: servico });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/servicos");
    });
};

exports.getAll = (req, res, next) => {
  Servicos.findAll({
    include: [
      { model: Veiculos, attributes: ["veiculos_placa", "veiculos_modelo"] },
      { model: Telefones, attributes: ["telefone"] },
      { model: Documentos, attributes: ["doc_cnh", "doc_cpf", "doc_empresa"] },
    ],
  })
    .then((servicos) => {
      res.render("listarservicos", { servicos: servicos });
    })
    .catch((err) => {
      console.log(err);
      res.render("listarservicos", { msg: "Erro ao buscar serviços" });
    });
};
