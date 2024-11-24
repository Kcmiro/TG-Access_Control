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

  if (
    !servico_nome ||
    !veiculos_placa ||
    !veiculos_modelo ||
    !telefone ||
    !doc_cnh ||
    !doc_cpf ||
    !doc_empresa
  ) {
    return res.render("editarservicos", { msg: "Preencha todos os campos" });
  }

  Promise.all([
    Veiculos.findOne({ where: { veiculos_placa: veiculos_placa } }),
    Telefones.findOne({ where: { telefone: telefone } }),
    Documentos.findOne({ where: { doc_cnh: doc_cnh } }),
    Documentos.findOne({ where: { doc_cpf: doc_cpf } }),
  ]).then(
    ([veiculoExistente, telefoneExistente, cnhExistente, cpfExistente]) => {
      if (veiculoExistente) {
        return res.render("editarservicos", {
          msg: "Placa de veículo já cadastrada",
        });
      }
      if (telefoneExistente) {
        return res.render("editarservicos", { msg: "Telefone já cadastrado" });
      }
      if (cnhExistente) {
        return res.render("editarservicos", { msg: "CNH já cadastrada" });
      }
      if (cpfExistente) {
        return res.render("editarservicos", { msg: "CPF já cadastrado" });
      }
    }
  );

  // Atualizações em veículos, telefones e documentos
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
          return Servicos.update(
            {
              servico_nome: servico_nome,
              servico_descricao: servico_descricao,
              veiculoId: veiculo.id,
              telefoneId: tel.id,
              documentoId: doc.id,
            },
            { where: { id: id } }
          );
        });
      });
    })
    .then(() => {
      res.redirect("/servicos/listarservicos", {
        msg: "Serviço atualizado com sucesso",
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("editarservicos", { msg: "Erro ao atualizar Serviço" });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;
  Servicos.destroy({ where: { id: id } })
    .then(() => {
      res.redirect("/servicos/listarservicos");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/servicos/listarservicos");
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
    .then((servicos) => {
      console.log(servicos);
      res.render("editarservicos", { servicos: servicos });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/servicos/listarservicos");
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
