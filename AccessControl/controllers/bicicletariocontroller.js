const express = require("express");
const Bicicletas = require("../models/bicicletario");
const Telefones = require("../models/telefone");
const { where, Model } = require("sequelize");
const bicicletario = require("../models/bicicletario");
const { Op } = require("sequelize");

exports.mostrarBicicletas = (req, res, next) => {
  res.render("bicicletariocadastro", { msg: "" });
};

exports.create = (req, res, next) => {
  const bike_nome = req.body.bike_nome;
  const bike_cor = req.body.bike_cor;
  const bike_loja = req.body.bike_loja;
  const telefone = req.body.telefone;

  if (!bike_nome || !bike_cor || !telefone) {
    return res.render("bicicletario", { msg: "Preecha todos os campos" });
  }

  Promise.all([
    Telefones.findOne({ where: { telefone: telefone } }), // Verifica telefone
  ])
    .then(([telefoneExistente]) => {
      // Se não houver duplicidade, cria o veiculo, telefone, documento e serviço
      return Promise.all([
        // Cria os registros se não existirem

        telefoneExistente ||
          Telefones.create({
            telefone: telefone,
          }),
      ]);
    })
    .then(([tel]) => {
      // Agora cria o serviço com as chaves estrangeiras
      return Bicicletas.create({
        bike_nome: bike_nome,
        bike_cor: bike_cor,
        bike_loja: bike_loja,
        telefoneId: tel.id, // Referência para o telefone
      });
    })
    .then((bikecriado) => {
      res.render("bicicletariocadastro", {
        msg: "Servico cadastrada com sucesso",
        bicicletas: bikecriado,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("bicicletascadastro", { msg: "Erro ao cadastrar Servico" });
    });
};

exports.update = (req, res, next) => {
  const id = req.params.id; // O ID da bicicleta que estamos atualizando
  const bike_nome = req.body.bike_nome;
  const bike_cor = req.body.bike_cor;
  const bike_loja = req.body.bike_loja;
  const telefone = req.body.telefone;

  if (!bike_nome || !bike_cor || !telefone) {
    return res.render("editarbicicletario", { msg: "Preecha todos os campos" });
  }

  Promise.all([
    Telefones.findOne({ where: { telefone: telefone } }), // Verifica se o telefone já existe
  ])
    .then(([telefoneExistente]) => {
      // Se o telefone não existir, cria um novo
      return Promise.all([
        telefoneExistente ||
          Telefones.create({
            telefone: telefone,
          }),
      ]);
    })
    .then(([tel]) => {
      // Agora atualiza a bicicleta
      return Bicicletas.update(
        {
          bike_nome: bike_nome,
          bike_cor: bike_cor,
          bike_loja: bike_loja,
          telefoneId: tel.id, // Atualiza o telefoneId da bicicleta
        },
        {
          where: { id: id }, // Garantindo que estamos atualizando a bicicleta correta
        }
      );
    })
    .then(([affectedRows]) => {
      if (affectedRows === 0) {
        // Se nenhum registro for afetado, significa que a bicicleta não foi encontrada
        return res.render("editarbicicletas", {
          msg: "Bicicleta não encontrada ou nada foi alterado.",
        });
      }

      // Se a atualização for bem-sucedida, redireciona para a lista de bicicletas
      return res.redirect("/bicicletario/listarbicicletas"); // Redirecionando para a lista das bicicletas
    })
    .catch((err) => {
      console.log(err);
      res.render("editarbicicletas", { msg: "Erro ao atualizar a bicicleta." });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;
  Bicicletas.destroy({ where: { id: id } })
    .then(() => {
      res.redirect("/bicicletario/listarbicicletas");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/bicicletario/listarbicicletas");
    });
};

exports.getOne = (req, res, next) => {
  const id = req.params.id; // Obtenha o id da bicicleta da URL

  // Buscando a bicicleta com o relacionamento de telefone
  Bicicletas.findByPk(id, {
    include: [
      {
        model: Telefones, // Incluindo o modelo Telefones
        attributes: ["telefone"], // Pegando apenas o campo telefone
      },
    ],
  })
    .then((bicicletario) => {
      // Verifica se a bicicleta foi encontrada
      if (!bicicletario) {
        return res.redirect("/bicicletario/listarbicicletas"); // Redireciona se não encontrar a bicicleta
      }
      // Renderiza a página de edição com os dados da bicicleta
      res.render("editarbicicletas", {
        msg: "Bicicleta encontrada", // Mensagem para o usuário
        bicicletario: bicicletario, // Passando os dados da bicicleta para o formulário
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/bicicletario/listarbicicletas"); // Em caso de erro, redireciona para a lista de bicicletas
    });
};

exports.getAll = (req, res, next) => {
  const query = req.query.query || ""; // Pega o valor da pesquisa (caso exista)

  let whereCondition = {
    [Op.or]: [
      { bike_nome: { [Op.like]: `%${query}%` } }, // Pesquisa por nome
      { bike_loja: { [Op.like]: `%${query}%` } }, // Pesquisa por loja
      {
        "$telefone.telefone$": { [Op.like]: `%${query}%` }, // Pesquisa por telefone
      },
    ],
  };

  Bicicletas.findAll({
    where: whereCondition, // Aplica o filtro de pesquisa
    order: [
      ["id", "ASC"],
      ["bike_nome", "ASC"],
    ],
    attributes: ["id", "bike_nome", "bike_cor", "bike_loja"],
    include: [
      {
        model: Telefones,
        required: true,
        attributes: ["telefone"],
      },
    ],
  })
    .then((bicicletarios) => {
      res.render("listarbicicletas", {
        msg: "Lista encontrada",
        bicicletarios: bicicletarios, // Passando a variável bicicletarios para a view
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("listarbicicletas", { msg: "Erro ao buscar bicicletários" });
    });
};

exports.getAllPatio = (req, res, next) => {
  const query = req.query.query || ""; // Pega o valor da pesquisa (caso exista)

  let whereCondition = {
    [Op.or]: [
      { bike_nome: { [Op.like]: `%${query}%` } }, // Pesquisa por nome
      { bike_loja: { [Op.like]: `%${query}%` } }, // Pesquisa por loja
      {
        "$telefone.telefone$": { [Op.like]: `%${query}%` }, // Pesquisa por telefone
      },
    ],
  };

  Bicicletas.findAll({
    where: whereCondition, // Aplica o filtro de pesquisa
    order: [
      ["id", "ASC"],
      ["bike_nome", "ASC"],
    ],
    attributes: ["id", "bike_nome", "bike_cor", "bike_loja"],
    include: [
      {
        model: Telefones,
        required: true,
        attributes: ["telefone"],
      },
    ],
  })
    .then((bicicletarios) => {
      res.render("consultarbicicletas", {
        msg: "Lista encontrada",
        bicicletarios: bicicletarios, // Passando a variável bicicletarios para a view
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("consultarbicicletas", {
        msg: "Erro ao buscar bicicletários",
      });
    });
};

exports.getOnePatio = (req, res, next) => {
  const id = req.params.id; // Obtenha o id da bicicleta da URL

  // Buscando a bicicleta com o relacionamento de telefone
  Bicicletas.findByPk(id, {
    include: [
      {
        model: Telefones, // Incluindo o modelo Telefones
        attributes: ["telefone"], // Pegando apenas o campo telefone
      },
    ],
  })
    .then((bicicletario) => {
      // Verifica se a bicicleta foi encontrada
      if (!bicicletario) {
        return res.redirect("/bicicletario/listarbicicletas"); // Redireciona se não encontrar a bicicleta
      }
      // Renderiza a página de edição com os dados da bicicleta
      res.render("editarbicicletas", {
        msg: "Bicicleta encontrada", // Mensagem para o usuário
        bicicletario: bicicletario, // Passando os dados da bicicleta para o formulário
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/bicicletario/listarbicicletas"); // Em caso de erro, redireciona para a lista de bicicletas
    });
};
