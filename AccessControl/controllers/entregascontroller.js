const express = require("express");
const Entregas = require("../models/entregas");
const Veiculos = require("../models/veiculos");
const Documentos = require("../models/documentos");
const Telefone = require("../models/telefone");

exports.create = async (req, res, next) => {
  const {
    entregas_nome,
    veiculos_placa,
    veiculos_modelo,
    doc_cpf,
    doc_cnh,
    doc_empresa,
    telefone,
  } = req.body;

  if (
    !entregas_nome ||
    !veiculos_placa ||
    !veiculos_modelo ||
    !doc_cpf ||
    !doc_cnh ||
    !doc_empresa ||
    !telefone
  ) {
    res.render("entregas", { msg: "Preencha todos os campos" });
  }

  try {
    // Verificar se o telefone já existe
    const existingTelefone = await Telefone.findOne({ where: { telefone } });
    if (existingTelefone) {
      res.render("entregas", { msg: "Este número de telefone já existe" });
      return res.status(400).json({ mensagem: "" });
    }
    // Verificar se o CPF já existe
    const existingCPF = await Documentos.findOne({ where: { doc_cpf } });
    if (existingCPF) {
      res.render("entregas", { msg: "Este número de CPF já existe" });
    }

    // Verificar se o CNH já existe
    const existingCNH = await Documentos.findOne({ where: { doc_cnh } });
    if (existingCNH) {
      res.render("entregas", { msg: "Este número de cnh já existe" });
    }

    // Verificar se a placa do veículo já existe
    const existingVeiculo = await Veiculos.findOne({
      where: { placa: veiculos_placa },
    });
    if (existingVeiculo) {
      res.render("entregas", { msg: "Placa já cadastrada" });
    }

    // Criar veículo
    const veiculos = await Veiculos.create({
      placa: veiculos_placa,
      modelo: veiculos_modelo,
    });

    // Criar entrega
    const entrega = await Entregas.create({
      entregas_nome,
      veiculoId: veiculos.id,
    });

    // Criar documento
    const documento = await Documentos.create({
      doc_cnh,
      doc_empresa,
      entregaId: entrega.id,
    });

    // Criar telefone
    const telefoneCreated = await Telefone.create({
      telefone,
      entregaId: entrega.id,
    });

    res.render("entregas", {
      msg: "Entrega criada com sucesso",
      entrega,
      documento,
      telefone: telefoneCreated,
    });
  } catch (error) {
    console.error(error);

    res.render("entregas", { msg: " Erro ao criar entrega" });
  }
};

exports.update = async (req, res, next) => {
  const {
    id,

    entregas_nome,

    veiculos_placa,

    veiculos_modelo,

    doc_cpf,

    doc_cnh,

    doc_empresa,

    telefone,
  } = req.body;

  if (
    !id ||
    !entregas_nome ||
    !veiculos_placa ||
    !veiculos_modelo ||
    !doc_cpf ||
    !doc_cnh ||
    !doc_empresa ||
    !telefone
  ) {
    return res.status(400).json({ mensagem: "Campos não definidos" });
  }

  try {
    const entrega = await Entregas.findByPk(id);

    if (!entrega) {
      return res.status(404).json({ mensagem: "Entrega não encontrada" });
    }

    // Atualizar entrega

    await entrega.update({
      entregas_nome,
    });

    // Atualizar veículo

    const veiculos = await Veiculos.findOne({ where: { entregaId: id } });

    if (veiculo) {
      await veiculos.update({
        placa: veiculos_placa,

        modelo: veiculos_modelo,
      });
    }

    // Atualizar documento

    const documento = await Documentos.findOne({ where: { entregaId: id } });

    if (documento) {
      await documento.update({
        doc_cnh,

        doc_empresa,
      });
    }

    // Atualizar telefone

    const telefoneRecord = await Telefone.findOne({ where: { entregaId: id } });

    if (telefoneRecord) {
      await telefoneRecord.update({
        telefone,
      });
    }

    res.status(200).json({
      mensagem: "Entrega atualizada com sucesso",

      entrega,

      veiculos,

      documento,

      telefone: telefoneRecord,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ mensagem: "Erro ao atualizar entrega" });
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "ID não fornecido" });
  }

  try {
    const entrega = await Entregas.findByPk(id);

    if (!entrega) {
      return res.status(404).json({ mensagem: "Entrega não encontrada" });
    }

    // Deletar veículo associado
    await Veiculos.destroy({ where: { entregaId: id } });

    // Deletar documento associado
    await Documentos.destroy({ where: { entregaId: id } });

    // Deletar telefone associado
    await Telefone.destroy({ where: { entregaId: id } });

    // Deletar a entrega
    await entrega.destroy();

    res
      .status(200)
      .json({ mensagem: "Entrega e dados associados deletados com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao deletar entrega" });
  }
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res.render("entregas", { msg: "ID Não Fornecido" });
  }

  try {
    const entrega = await Entregas.findByPk(id, {
      include: [
        {
          model: Veiculos,
          as: "veiculos",
        },
        {
          model: Documentos,
          as: "documento",
        },
        {
          model: Telefone,
          as: "telefone",
        },
      ],
    });

    if (!entrega) {
      res.render("entregas", { msg: "Entrega não encontrada" });
    }

    res.render("entregas", {
      msg: "Preencha todos os campos",
      mensagem: "Entrega encontrada com sucesso",
      entrega: {
        id: entrega.id,
        entregas_nome: entrega.entregas_nome,
        veiculos: entrega.veiculos
          ? {
              placa: entrega.veiculos.placa,
              modelo: entrega.veiculos.modelo,
            }
          : null,
        documento: entrega.documento
          ? {
              doc_cpf: entrega.documento.doc_cpf,
              doc_cnh: entrega.documento.doc_cnh,
              doc_empresa: entrega.documento.doc_empresa,
            }
          : null,
        telefone: entrega.telefone ? entrega.telefone.telefone : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.render("entregas", { msg: "Erro ao buscar entregas" });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const entregas = await Entregas.findAll({
      include: [
        {
          model: Veiculos,
          as: "veiculos",
        },
        {
          model: Documentos,
          as: "documento",
        },
        {
          model: Telefone,
          as: "telefone",
        },
      ],
    });

    if (entregas.length === 0) {
      res.render("entregas", { msg: "Nenhuma entrega encontrada" });
    }

    const formattedEntregas = entregas.map((entrega) => ({
      id: entrega.id,
      entregas_nome: entrega.entregas_nome,
      veiculos: entrega.veiculos
        ? {
            placa: entrega.veiculos.placa,
            modelo: entrega.veiculos.modelo,
          }
        : null,
      documento: entrega.documento
        ? {
            doc_cpf: entrega.documento.doc_cpf,
            doc_cnh: entrega.documento.doc_cnh,
            doc_empresa: entrega.documento.doc_empresa,
          }
        : null,
      telefone: entrega.telefone ? entrega.telefone.telefone : null,
    }));

    res.render("entregas", {
      msg: "Preencha todos os campos",
      mensagem: "Entregas encontradas com sucesso",
      entregas: formattedEntregas,
    });
  } catch (error) {
    console.error(error);
    res.render("entregas", { msg: "Erro ao busca entregas" });
  }
};
