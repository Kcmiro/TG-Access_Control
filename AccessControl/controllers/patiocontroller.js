const express = require("express");
const Patio = require("../models/registro_patio");
const Entregas = require("../models/entregas");
const Veiculos = require("../models/veiculos");
const Telefones = require("../models/telefone");
const Documentos = require("../models/documentos");
const Lojas = require("../models/lojas");
const Servico = require("../models/servicos");
const Bike = require("../models/bicicletario");
const { Op } = require("sequelize");
const { where } = require("sequelize");

exports.patioEntregas = async (req, res, next) => {
  const id = req.params.id; // ID do pátio (entrega) passado pela URL
  const { patio_horaentrada, lojaNome } = req.body; // Pegando os dados do formulário
  const entregaId = req.body.entregaId || id;
  console.log("Usuario logado:", req.session.Usuario); // Usando o valor da entrega do corpo da requisição ou o ID da URL
  const usuarioId = req.body.usuarioId || req.Usuario.id; // Usuário logado (assumindo que o req.user foi preenchido pela autenticação)

  console.log("Recebido:", {
    patio_horaentrada,
    lojaNome,
    entregaId,
    usuarioId,
  });

  try {
    // Verificar se a loja já existe
    let loja = await Lojas.findOne({ where: { lojaNome: lojaNome } });

    if (!loja) {
      console.log("Loja não encontrada, criando nova loja:", lojaNome);
      loja = await Lojas.create({ lojaNome: lojaNome });

      // Verificar se a loja foi criada corretamente
      if (!loja || !loja.id) {
        return res.status(500).render("entregascadastro", {
          msg: "Erro ao criar a loja.",
        });
      }
    }

    console.log("Loja encontrada ou criada:", loja);

    // Registrar a entrada no pátio
    const entradaPatio = await Patio.create({
      patio_horaentrada: patio_horaentrada, // Usando a data passada ou a atual
      entregaId: entregaId, // Relacionando com a entrega
      usuarioId: req.Usuario.id, // Relacionando com o usuário logado
      lojaId: loja.id, // Relacionando com a loja (chave estrangeira)
    });

    console.log("Entrada no pátio criada:", entradaPatio);

    // Verificar se a entrada no pátio foi criada com sucesso
    if (!entradaPatio) {
      return res.status(500).render("entregascadastro", {
        msg: "Erro ao registrar a entrada no pátio.",
      });
    }

    // Redirecionar para a página de cadastro de entregas
    return res.render("entregascadastro", {
      msg: "REGISTRO FEITO COM SUCESSO",
    });
  } catch (err) {
    console.error("Erro ao criar o pátio:", err); // Captura de erro detalhado
    return res.render("entregascadastro", {
      msg: "Erro ao atualizar os dados.",
    });
  }
};
exports.patioServicos = async (req, res, next) => {
  const id = req.params.id; // ID do pátio (entrega) passado pela URL
  const { patio_horaentrada, lojaNome } = req.body; // Pegando os dados do formulário
  const servicoId = req.body.entregaId || id;
  console.log("Usuario logado:", req.session.Usuario); // Usando o valor da entrega do corpo da requisição ou o ID da URL
  const usuarioId = req.body.usuarioId || req.Usuario.id; // Usuário logado (assumindo que o req.user foi preenchido pela autenticação)

  console.log("Recebido:", {
    patio_horaentrada,
    lojaNome,
    servicoId,
    usuarioId,
  });

  try {
    // Verificar se a loja já existe
    let loja = await Lojas.findOne({ where: { lojaNome: lojaNome } });

    if (!loja) {
      console.log("Loja não encontrada, criando nova loja:", lojaNome);
      loja = await Lojas.create({ lojaNome: lojaNome });

      // Verificar se a loja foi criada corretamente
      if (!loja || !loja.id) {
        return res.status(500).render("servicoscadastro", {
          msg: "Erro ao criar a loja.",
        });
      }
    }

    console.log("Loja encontrada ou criada:", loja);

    // Registrar a entrada no pátio
    const entradaPatio = await Patio.create({
      patio_horaentrada: patio_horaentrada, // Usando a data passada ou a atual
      servicoId: servicoId, // Relacionando com a entrega
      usuarioId: req.Usuario.id, // Relacionando com o usuário logado
      lojaId: loja.id, // Relacionando com a loja (chave estrangeira)
    });

    console.log("Entrada no pátio criada:", entradaPatio);

    // Verificar se a entrada no pátio foi criada com sucesso
    if (!entradaPatio) {
      return res.status(500).render("servicoscadastro", {
        msg: "Erro ao registrar a entrada no pátio.",
      });
    }

    // Redirecionar para a página de cadastro de entregas
    return res.render("servicoscadastro", {
      msg: "REGISTRO FEITO COM SUCESSO",
    });
  } catch (err) {
    console.error("Erro ao criar o pátio:", err); // Captura de erro detalhado
    return res.render("servicocadastro", {
      msg: "Erro ao atualizar os dados.",
    });
  }
};

exports.patioBike = async (req, res, next) => {
  const id = req.params.id; // ID do pátio (entrega) passado pela URL
  const { patio_horaentrada, lojaNome } = req.body; // Pegando os dados do formulário
  const bicicletarioId = req.body.entregaId || id;
  console.log("Usuario logado:", req.session.Usuario); // Usando o valor da entrega do corpo da requisição ou o ID da URL
  const usuarioId = req.body.usuarioId || req.Usuario.id; // Usuário logado (assumindo que o req.user foi preenchido pela autenticação)

  console.log("Recebido:", {
    patio_horaentrada,
    bicicletarioId,
    usuarioId,
  });

  try {
    const entradaPatio = await Patio.create({
      patio_horaentrada: patio_horaentrada,
      bicicletarioId: bicicletarioId,
      usuarioId: req.Usuario.id,
    });

    console.log("Entrada no pátio criada:", entradaPatio);

    // Verificar se a entrada no pátio foi criada com sucesso
    if (!entradaPatio) {
      return res.status(500).render("bicicletariocadastro", {
        msg: "Erro ao registrar a entrada no pátio.",
      });
    }

    // Redirecionar para a página de cadastro de entregas
    return res.render("bicicletariocadastro", {
      msg: "REGISTRO FEITO COM SUCESSO",
    });
  } catch (err) {
    console.error("Erro ao criar o pátio:", err); // Captura de erro detalhado
    return res.render("bicicletariocadastro", {
      msg: "Erro ao atualizar os dados.",
    });
  }
};

exports.patioSaida = (req, res, next) => {
  const patio_horasaida = new Date();
  const patioId = req.params.id; // Supondo que o ID do 'patio' é passado via body

  // Adicionando a condição WHERE
  Patio.update(
    { patio_horasaida: patio_horasaida }, // Atributos que serão atualizados
    { where: { id: patioId } } // Condição WHERE para identificar o registro a ser atualizado
  )
    .then(() => {
      res.redirect("/patio/patio"); // Redireciona para a lista de chaves
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/patio/patio"); // Em caso de erro, redireciona de volta
    });
};

exports.patio = (req, res, next) => {
  const query = req.query.query || "";
  let whereCondition = {
    [Op.and]: [
      {
        [Op.or]: [
          {
            "$entrega.telefone.telefone$": { [Op.like]: `%${query}%` },
          },
          {
            "$entrega.entregas_nome$": { [Op.like]: `%${query}%` },
          },
          {
            "$entrega.veiculo.veiculos_placa$": { [Op.like]: `%${query}%` },
          },
          {
            "$entrega.veiculo.veiculos_modelo$": { [Op.like]: `%${query}%` },
          },
          {
            "$entrega.documento.doc_cnh$": { [Op.like]: `%${query}%` },
          },
          {
            "$entrega.documento.doc_empresa$": { [Op.like]: `%${query}%` },
          },
          {
            "$entrega.documento.doc_cpf$": { [Op.like]: `%${query}%` },
          },
          {
            "$servico.servico_nome$": { [Op.like]: `%${query}%` },
          },
          {
            "$servico.telefone.telefone$": { [Op.like]: `%${query}%` },
          },
          {
            "$servico.veiculo.veiculos_placa$": { [Op.like]: `%${query}%` },
          },
          {
            "$servico.veiculo.veiculos_modelo$": { [Op.like]: `%${query}%` },
          },
          {
            "$servico.documento.doc_cnh$": { [Op.like]: `%${query}%` },
          },
          {
            "$servico.documento.doc_empresa$": { [Op.like]: `%${query}%` },
          },
          {
            "$servico.documento.doc_cpf$": { [Op.like]: `%${query}%` },
          },
          {
            "$bicicletario.bike_nome$": { [Op.like]: `%${query}%` },
          },
          {
            "$bicicletario.telefone.telefone$": { [Op.like]: `%${query}%` },
          },
        ],
      },
      {
        patio_horaentrada: { [Op.col]: "patio_horasaida" },
      },
    ],
  };

  Patio.findAll({
    where: whereCondition,
    order: [["patio_horaentrada", "ASC"]],
    attributes: ["id", "patio_horaentrada", "patio_horasaida"],
    include: [
      {
        model: Entregas,
        required: false,
        attributes: ["entregas_nome", "status"],
        include: [
          {
            model: Veiculos,
            attributes: ["veiculos_placa", "veiculos_modelo"],
          },
          {
            model: Documentos,
            attributes: ["doc_empresa", "doc_cnh", "doc_cpf"],
          },
          {
            model: Telefones,
            attributes: ["telefone"],
          },
        ],
      },
      {
        model: Servico,
        required: false,
        attributes: ["servico_nome", "status"],
        include: [
          {
            model: Veiculos,
            attributes: ["veiculos_placa", "veiculos_modelo"],
          },
          {
            model: Documentos,
            attributes: ["doc_empresa", "doc_cnh", "doc_cpf"],
          },
          {
            model: Telefones,
            attributes: ["telefone"],
          },
        ],
      },
      {
        model: Bike,
        required: false,
        attributes: ["bike_nome", "bike_cor", "bike_loja", "status"],
        include: [
          {
            model: Telefones,
            attributes: ["telefone"],
          },
        ],
      },
      {
        model: Lojas,
        required: false,
        attributes: ["lojaNome"],
      },
    ],
  })
    .then((patios) => {
      // Contadores de status
      let contadorBike = 0;
      let contadorEntregas = 0;
      let contadorServicos = 0;

      patios.forEach((patio) => {
        if (patio.entrega && patio.entrega.status === "entregas") {
          contadorEntregas++;
        }
        if (patio.servico && patio.servico.status === "servicos") {
          contadorServicos++;
        }
        if (patio.bicicletario && patio.bicicletario.status === "bike") {
          contadorBike++;
        }
      });

      // Passar os contadores e dados para o template
      res.render("patio", {
        patios: patios,
        msg: "", // Mensagem de sucesso
        contadorBike: contadorBike,
        contadorEntregas: contadorEntregas,
        contadorServicos: contadorServicos,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("patio", {
        patios: [],
        msg: "Erro ao carregar as entregas.",
        contadorBike: 0,
        contadorEntregas: 0,
        contadorServicos: 0,
      });
    });
};
