const pdfkit = require("pdfkit");
const path = require("path");
const fs = require("fs");
const chaves = require("../models/chaves");
const Entregas = require("../models/entregas");
const Veiculos = require("../models/veiculos");
const Documentos = require("../models/documentos");
const Telefones = require("../models/telefone");
const Servicos = require("../models/servicos");
const Bicicletario = require("../models/bicicletario");

exports.home = (req, res, next) => {
  if (req.session.Usuario) {
    // Passando a variável usuario para o template EJS
    res.render("index", { Usuario: req.session.Usuario });
  } else {
    res.redirect("/usuario/login");
  }
};
exports.sair = (req, res, next) => {
  res.render("/", { msg: "" });
};
exports.relatorio = (req, res, next) => {
  const { relatorio } = req.body;
  let msg = "";

  // Verifica se o tipo de relatório é 'chaves'
  if (relatorio === "chaves") {
    msg = "Relatório de Chaves gerado com sucesso!";

    // Cria o diretório 'relatorios' se não existir
    const dirPath = path.join(__dirname, "../public/relatorios");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Obtém as chaves do banco de dados
    chaves
      .findAll({
        order: [["chave_id", "ASC"]],
        attributes: ["chave_id", "chave_nome"],
      })
      .then((chavesData) => {
        if (chavesData.length === 0) {
          msg = "Não há chaves cadastradas para gerar o relatório.";
          return res.render("relatorio", { msg }); // Retorna com a mensagem
        }

        // Criação do PDF
        const doc = new pdfkit();

        // Definindo o tipo de conteúdo e o cabeçalho para o PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=chaves.pdf");

        // Envia o PDF diretamente para o navegador
        doc.pipe(res);

        // Cabeçalho com logo e título
        doc.image(
          path.join(__dirname, "../public/imagens/Logo_Buriti_Mogi.png"),
          50,
          50,
          {
            width: 100,
          }
        );
        doc.moveDown();
        doc
          .font("Helvetica-Bold")
          .fontSize(24)
          .fillColor("#333")
          .text("Relatório de Chaves", { align: "center" });
        doc.moveDown();

        // Data do Relatório
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#333")
          .text("Data: " + new Date().toLocaleDateString(), { align: "right" });
        doc.moveDown(2);

        // Tabela com bordas e preenchimentos

        const tableStartY = doc.y;
        doc.font("Helvetica-Bold").fontSize(12).fillColor("#333");
        doc.rect(50, tableStartY, 30, 16).stroke();
        doc.text("ID", 55, tableStartY + 5);

        doc.rect(80, tableStartY, 150, 16).stroke();
        doc.text(`Nome`, 140, tableStartY + 5);

        doc.moveDown(0);

        // Preencher a tabela com os dados das chaves
        doc.font("Helvetica").fontSize(8).fillColor("#333");
        chavesData.forEach((chave) => {
          let yPosition = doc.y;

          if (yPosition > 750) {
            doc.addPage();
            yPosition = doc.y; // Resetando a posição Y para a nova página
          }

          // Desenha as linhas da tabela e preenche com os dados
          doc.rect(50, yPosition, 30, 14).stroke();
          doc.text(`${chave.chave_id}`, 20, yPosition + 5, {
            width: 90,
            align: "center",
          });
          doc.rect(80, yPosition, 150, 14).stroke();
          doc.text(`${chave.chave_nome}`, 80, yPosition + 5, {
            width: 140,
            align: "center",
          });
          doc.moveDown(0);
        });

        // Rodapé com número de página
        doc.on("pageAdded", function () {
          const pageNumber = doc.pageCount;
          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#aaa")
            .text(`Página ${pageNumber}`, 520, 780);
        });

        // Finaliza a criação do PDF
        doc.end();
      })
      .catch((err) => {
        console.error(err);
        res.render("relatorio", {
          msg: "Erro ao gerar o relatório de chaves.",
        });
      });
  } else if (relatorio === "entregas") {
    let msg = "Relatório de Entregas gerado com sucesso!";

    // Cria o diretório 'relatorios' se não existir
    const dirPath = path.join(__dirname, "../public/relatorios");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Obtém as entregas do banco de dados
    Entregas.findAll({
      order: [["id", "ASC"]],
      attributes: ["id", "entregas_nome"],
      include: [
        {
          model: Veiculos,
          required: true,
          attributes: ["veiculos_placa", "veiculos_modelo"],
        },
        {
          model: Documentos,
          required: true,
          attributes: ["doc_cnh", "doc_cpf", "doc_empresa"],
        },
        {
          model: Telefones,
          required: true,
          attributes: ["telefone"],
        },
      ],
    })
      .then((entregasData) => {
        if (entregasData.length === 0) {
          msg = "Não há entregas cadastradas para gerar o relatório.";
          return res.render("listarentregas", { msg });
        }

        // Criação do PDF
        const doc = new pdfkit();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "inline; filename=relatorio_entregas.pdf"
        );

        // Envia o PDF diretamente para o navegador
        doc.pipe(res);

        // Cabeçalho com logo e título
        doc.image(
          path.join(__dirname, "../public/imagens/Logo_Buriti_Mogi.png"),
          50,
          50,
          {
            width: 100,
          }
        );
        doc.moveDown();
        doc
          .font("Helvetica-Bold")
          .fontSize(24)
          .fillColor("#333")
          .text("Relatório de Entregas", { align: "center" });
        doc.moveDown();

        // Data do Relatório
        doc
          .font("Helvetica")
          .fontSize(12)
          .fillColor("#333")
          .text("Data: " + new Date().toLocaleDateString(), { align: "right" });
        doc.moveDown(2);

        // Tabela com bordas e preenchimentos
        const tableStartY = doc.y; // Guarda a posição inicial para a tabela

        // Cabeçalho da Tabela
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#333");
        doc.rect(50, tableStartY, 30, 16).stroke();
        doc.text("ID", 55, tableStartY + 5);

        doc.rect(80, tableStartY, 150, 16).stroke();
        doc.text(`Nome`, 140, tableStartY + 5);

        doc.rect(230, tableStartY, 100, 16).stroke();
        doc.text(`Telefone`, 260, tableStartY + 5);

        doc.rect(330, tableStartY, 120, 16).stroke(); // Coluna Veículo
        doc.text(`Placa - Modelo`, 360, tableStartY + 5);

        doc.rect(450, tableStartY, 120, 16).stroke();
        doc.text(`CNH - CPF`, 485, tableStartY + 5);

        // Preenchendo a Tabela com os dados das entregas
        doc.font("Helvetica").fontSize(8).fillColor("#333");

        entregasData.forEach((entrega, index) => {
          let yPosition = doc.y;

          // Adicionando nova página se o conteúdo for muito grande
          if (yPosition > 750) {
            doc.addPage();
            yPosition = doc.y; // Resetando a posição Y para a nova página
          }

          // Linha de dados das entregas
          doc.rect(50, yPosition, 30, 14).stroke();
          doc.text(`${entrega.id}`, 20, yPosition + 5, {
            width: 90,
            align: "center",
          });

          doc.rect(80, yPosition, 150, 14).stroke();
          doc.text(`${entrega.entregas_nome}`, 80, yPosition + 5, {
            width: 140,
            align: "center",
          });

          doc.rect(230, yPosition, 100, 14).stroke();
          doc.text(`${entrega.telefone.telefone}`, 230, yPosition + 5, {
            width: 90,
            align: "center",
          });

          doc.rect(330, yPosition, 120, 14).stroke();
          doc.text(
            `${entrega.veiculo.veiculos_placa} - ${entrega.veiculo.veiculos_modelo}`,
            330,
            yPosition + 5,
            { width: 110, align: "center" }
          );

          doc.rect(450, yPosition, 120, 14).stroke();
          doc.text(
            `${entrega.documento.doc_cnh} - ${entrega.documento.doc_cpf}`,
            450,
            yPosition + 5,
            { width: 110, align: "center" }
          );

          doc.moveDown(0);
        });

        // Rodapé com número de página
        doc.on("pageAdded", function () {
          const pageNumber = doc.pageCount;
          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#aaa")
            .text(`Página ${pageNumber}`, 520, 780);
        });

        // Finaliza a criação do PDF
        doc.end();
      })
      .catch((err) => {
        console.error(err);
        res.render("listarentregas", {
          msg: "Erro ao gerar o relatório de entregas.",
        });
      });
  } else if (relatorio === "servicos") {
    let msg = "Relatório de Serviços gerado com sucesso!";

    // Cria o diretório 'relatorios' se não existir
    const dirPath = path.join(__dirname, "../public/relatorios");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Obtém os serviços do banco de dados
    Servicos.findAll({
      include: [
        { model: Veiculos, attributes: ["veiculos_placa", "veiculos_modelo"] },
        { model: Telefones, attributes: ["telefone"] },
        {
          model: Documentos,
          attributes: ["doc_cnh", "doc_cpf", "doc_empresa"],
        },
      ],
    })
      .then((servicosData) => {
        if (servicosData.length === 0) {
          msg = "Não há serviços cadastrados para gerar o relatório.";
          return res.render("listarservicos", { msg });
        }

        // Criação do PDF
        const doc = new pdfkit();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "inline; filename=relatorio_servicos.pdf"
        );

        // Envia o PDF diretamente para o navegador
        doc.pipe(res);

        // Cabeçalho com logo e título
        doc.image(
          path.join(__dirname, "../public/imagens/Logo_Buriti_Mogi.png"),
          50,
          50,
          {
            width: 100,
          }
        );
        doc.moveDown();
        doc
          .font("Helvetica-Bold")
          .fontSize(24)
          .fillColor("#333")
          .text("Relatório de Serviços", { align: "center" });
        doc.moveDown();

        // Data do Relatório
        doc
          .font("Helvetica")
          .fontSize(12)
          .fillColor("#333")
          .text("Data: " + new Date().toLocaleDateString(), { align: "right" });
        doc.moveDown(2);

        // Tabela com bordas e preenchimentos
        const tableStartY = doc.y; // Guarda a posição inicial para a tabela

        // Cabeçalho da Tabela
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#333");
        doc.rect(50, tableStartY, 30, 16).stroke();
        doc.text("ID", 55, tableStartY + 5);

        doc.rect(80, tableStartY, 150, 16).stroke();
        doc.text(`Nome`, 140, tableStartY + 5);

        doc.rect(230, tableStartY, 100, 16).stroke();
        doc.text(`Telefone`, 260, tableStartY + 5);

        doc.rect(330, tableStartY, 120, 16).stroke(); // Coluna Veículo
        doc.text(`Placa - Modelo`, 360, tableStartY + 5);

        doc.rect(450, tableStartY, 120, 16).stroke();
        doc.text(`CNH - CPF`, 485, tableStartY + 5);

        // Preenchendo a Tabela com os dados dos serviços
        doc.font("Helvetica").fontSize(8).fillColor("#333");

        servicosData.forEach((servico, index) => {
          let yPosition = doc.y;

          // Adicionando nova página se o conteúdo for muito grande
          if (yPosition > 750) {
            doc.addPage();
            yPosition = doc.y; // Resetando a posição Y para a nova página
          }

          // Linha de dados dos serviços
          doc.rect(50, yPosition, 30, 14).stroke();
          doc.text(`${servico.id}`, 20, yPosition + 5, {
            width: 90,
            align: "center",
          });

          doc.rect(80, yPosition, 150, 14).stroke();
          doc.text(`${servico.servico_nome}`, 80, yPosition + 5, {
            width: 140,
            align: "center",
          });

          doc.rect(230, yPosition, 100, 14).stroke();
          doc.text(`${servico.telefone.telefone}`, 230, yPosition + 5, {
            width: 90,
            align: "center",
          });

          doc.rect(330, yPosition, 120, 14).stroke();
          doc.text(
            `${servico.veiculo.veiculos_placa} - ${servico.veiculo.veiculos_modelo}`,
            330,
            yPosition + 5,
            { width: 110, align: "center" }
          );

          doc.rect(450, yPosition, 120, 14).stroke();
          doc.text(
            `${servico.documento.doc_cnh} - ${servico.documento.doc_cpf}`,
            450,
            yPosition + 5,
            { width: 110, align: "center" }
          );

          doc.moveDown(0);
        });

        // Rodapé com número de página
        doc.on("pageAdded", function () {
          const pageNumber = doc.pageCount;
          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#aaa")
            .text(`Página ${pageNumber}`, 520, 780);
        });

        // Finaliza a criação do PDF
        doc.end();
      })
      .catch((err) => {
        console.error(err);
        res.render("listarservicos", {
          msg: "Erro ao gerar o relatório de serviços.",
        });
      });
  } else if (relatorio === "bicicletario") {
    let msg = "Relatório de Bicicletário gerado com sucesso!";

    // Cria o diretório 'relatorios' se não existir
    const dirPath = path.join(__dirname, "../public/relatorios");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Obtém os dados do bicicletário do banco de dados
    Bicicletario.findAll({
      order: [["id", "ASC"]],
      attributes: ["id", "bike_nome", "bike_loja", "bike_cor"],
      include: [{ model: Telefones, attributes: ["telefone"] }],
    })
      .then((bicicletarioData) => {
        if (bicicletarioData.length === 0) {
          msg =
            "Não há dados de bicicletário cadastrados para gerar o relatório.";
          return res.render("relatorio", { msg });
        }

        // Criação do PDF
        const doc = new pdfkit();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "inline; filename=relatorio_bicicletario.pdf"
        );

        // Envia o PDF diretamente para o navegador
        doc.pipe(res);

        // Cabeçalho com logo e título
        doc.image(
          path.join(__dirname, "../public/imagens/Logo_Buriti_Mogi.png"),
          50,
          50,
          {
            width: 100,
          }
        );
        doc.moveDown();
        doc
          .font("Helvetica-Bold")
          .fontSize(24)
          .fillColor("#333")
          .text("Relatório de Bicicletário", { align: "center" });
        doc.moveDown();

        // Data do Relatório
        doc
          .font("Helvetica")
          .fontSize(12)
          .fillColor("#333")
          .text("Data: " + new Date().toLocaleDateString(), { align: "right" });
        doc.moveDown(2);

        // Tabela com bordas e preenchimentos
        const tableStartY = doc.y; // Guarda a posição inicial para a tabela

        // Cabeçalho da Tabela
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#333");
        doc.rect(50, tableStartY, 30, 16).stroke();
        doc.text("ID", 55, tableStartY + 5);

        doc.rect(80, tableStartY, 150, 16).stroke();
        doc.text(`Nome`, 140, tableStartY + 5);

        doc.rect(230, tableStartY, 100, 16).stroke();
        doc.text(`Telefone`, 260, tableStartY + 5);

        doc.rect(330, tableStartY, 120, 16).stroke(); // Coluna Veículo
        doc.text(`Cor`, 360, tableStartY + 5);

        doc.rect(450, tableStartY, 120, 16).stroke();
        doc.text(`Loja`, 485, tableStartY + 5);

        // Preenchendo a Tabela com os dados do bicicletário
        doc.font("Helvetica").fontSize(8).fillColor("#333");

        bicicletarioData.forEach((bicicleta, index) => {
          let yPosition = doc.y;

          // Adicionando nova página se o conteúdo for muito grande
          if (yPosition > 750) {
            doc.addPage();
            yPosition = doc.y; // Resetando a posição Y para a nova página
          }

          // Linha de dados do bicicletário
          doc.rect(50, yPosition, 30, 14).stroke();
          doc.text(`${bicicleta.id}`, 20, yPosition + 5, {
            width: 90,
            align: "center",
          });

          doc.rect(80, yPosition, 150, 14).stroke();
          doc.text(`${bicicleta.bike_nome}`, 80, yPosition + 5, {
            width: 140,
            align: "center",
          });

          doc.rect(230, yPosition, 100, 14).stroke();
          doc.text(
            `${
              bicicleta.telefone ? bicicleta.telefone.telefone : "Sem Telefone"
            }`,
            230,
            yPosition + 5,
            {
              width: 90,
              align: "center",
            }
          );

          doc.rect(330, yPosition, 120, 14).stroke();
          doc.text(`${bicicleta.bike_cor}`, 330, yPosition + 5, {
            width: 110,
            align: "center",
          });

          doc.rect(450, yPosition, 120, 14).stroke();
          doc.text(`${bicicleta.bike_loja}`, 450, yPosition + 5, {
            width: 110,
            align: "center",
          });

          doc.moveDown(0);
        });

        // Rodapé com número de página
        doc.on("pageAdded", function () {
          const pageNumber = doc.pageCount;
          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#aaa")
            .text(`Página ${pageNumber}`, 520, 780);
        });

        // Finaliza a criação do PDF
        doc.end();
      })
      .catch((err) => {
        console.error(err);
        res.render("relatorio", {
          msg: "Erro ao gerar o relatório de bicicletário.",
        });
      });
  } else {
    msg = "Selecione um tipo de relatório.";
    res.render("relatorio", { msg });
  }
};
