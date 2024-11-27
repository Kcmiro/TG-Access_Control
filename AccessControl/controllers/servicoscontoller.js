const express = require("express");
const Servicos = require("../models/servicos");
const Veiculos = require("../models/veiculos");
const Documentos = require("../models/documentos");
const Telefones = require("../models/telefone");
const { where } = require("sequelize");
const { Op } = require("sequelize");

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

exports.update = async (req, res) => {
  const {
    servico_nome,
    telefone,
    veiculos_placa,
    veiculos_modelo,
    doc_cnh,
    doc_cpf,
    doc_empresa,
    servico_descricao,
  } = req.body;

  const servicoId = req.params.id; // ID do serviço a ser atualizado

  try {
    // Buscar o serviço
    const servico = await Servicos.findByPk(servicoId);

    if (!servico) {
      return res.status(404).send("Serviço não encontrado");
    }

    // Buscar ou criar o telefone
    let telefoneRecord = await Telefones.findOne({
      where: { telefone: telefone },
    });

    if (!telefoneRecord) {
      // Se o telefone não existir, cria um novo
      telefoneRecord = await Telefones.create({ telefone });
    }

    // Buscar ou atualizar o veículo
    let veiculoRecord = await Veiculos.findOne({
      where: { veiculos_placa: veiculos_placa },
    });

    if (!veiculoRecord) {
      // Se o veículo não existir, cria um novo
      veiculoRecord = await Veiculos.create({
        veiculos_placa: veiculos_placa,
        veiculos_modelo: veiculos_modelo,
      });
    } else {
      // Se o veículo existir, atualiza os dados
      veiculoRecord.veiculos_placa = veiculos_placa;
      veiculoRecord.veiculos_modelo = veiculos_modelo;
      await veiculoRecord.save();
    }

    // Buscar ou atualizar o documento (verificar doc_cnh)
    let documentoRecord = await Documentos.findOne({
      where: { doc_cnh },
    });

    if (!documentoRecord) {
      // Se o documento não existir, cria um novo
      documentoRecord = await Documentos.create({
        doc_cnh,
        doc_cpf,
        doc_empresa,
      });
    } else {
      // Verificando se o doc_cnh foi alterado e deve ser atualizado
      if (documentoRecord.doc_cnh !== doc_cnh) {
        // Atualiza o CNH apenas se for diferente
        documentoRecord.doc_cnh = doc_cnh;
      }

      // Verificando se o CPF foi alterado e deve ser atualizado
      if (documentoRecord.doc_cpf !== doc_cpf) {
        // Atualiza o CPF se for diferente
        documentoRecord.doc_cpf = doc_cpf;
      }

      // Atualiza o nome da empresa, sempre
      documentoRecord.doc_empresa = doc_empresa;

      // Salva as mudanças no banco
      await documentoRecord.save();
    }

    // Atualizar os dados do serviço
    servico.servico_nome = servico_nome;
    servico.telefoneId = telefoneRecord.id; // Atualiza com o id do telefone
    servico.veiculoId = veiculoRecord.id; // Atualiza com o id do veículo
    servico.documentoId = documentoRecord.id; // Atualiza com o id do documento
    servico.servico_descricao = servico_descricao;

    // Salvar o serviço com as novas informações
    await servico.save();

    // Redirecionar após a atualização
    res.redirect("/servicos/listarservicos"); // Redireciona para a página de serviços (ajuste conforme necessário)
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    res.status(500).send("Erro ao atualizar serviço");
  }
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
  const query = req.query.query || "";
  let whereCondition = {
    [Op.or]: [
      { servico_nome: { [Op.like]: `%${query}%` } },
      {
        "$telefone.telefone$": { [Op.like]: `%${query}%` },
      },
      {
        "$veiculo.veiculos_placa$": { [Op.like]: `%${query}%` },
      },
      {
        "$veiculo.veiculos_modelo$": { [Op.like]: `%${query}%` },
      },
      {
        "$documento.doc_cnh$": { [Op.like]: `%${query}%` },
      },
      {
        "$documento.doc_empresa$": { [Op.like]: `%${query}%` },
      },
      {
        "$documento.doc_cpf$": { [Op.like]: `%${query}%` },
      },
    ],
  };
  Servicos.findAll({
    where: whereCondition,
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
