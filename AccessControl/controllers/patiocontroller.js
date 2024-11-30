const express = require("express");
const Patio = require("../models/registro_patio");
const Lojas = require("../models/lojas");

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
    return res.redirect("/entregas/entregascadastro");
  } catch (err) {
    console.error("Erro ao criar o pátio:", err); // Captura de erro detalhado
    return res.render("entregascadastro", {
      msg: "Erro ao atualizar os dados.",
    });
  }
};
