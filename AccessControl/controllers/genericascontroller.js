const pdfkit = require("pdfkit");
const path = require("path");
const fs = require("fs");
const chaves = require("../models/chaves");

exports.home = (req, res, next) => {
  res.render("index");
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
          .fillColor("#007bff")
          .text("Relatório de Chaves", { align: "center" });
        doc.moveDown();

        // Data do Relatório
        doc
          .font("Helvetica")
          .fontSize(12)
          .fillColor("#333")
          .text("Data: " + new Date().toLocaleDateString(), { align: "right" });
        doc.moveDown(2);

        // Tabela com bordas e preenchimentos
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#fff")
          .rect(50, doc.y, 100, 20) // Coluna ID
          .fill("#007bff");
        doc.text("ID", 55, doc.y + 5);

        doc
          .rect(150, doc.y, 200, 20) // Coluna Nome
          .fill("#007bff");
        doc.text("Chave", 155, doc.y + 5);
        doc.moveDown(1);

        // Preencher a tabela com os dados das chaves
        doc.font("Helvetica").fontSize(12).fillColor("#333");
        chavesData.forEach((chave) => {
          let yPosition = doc.y;

          // Desenha as linhas da tabela e preenche com os dados
          doc.rect(50, yPosition, 100, 20).stroke();
          doc.text(`${chave.chave_id}`, 55, yPosition + 5);

          doc.rect(150, yPosition, 200, 20).stroke();
          doc.text(`${chave.chave_nome}`, 155, yPosition + 5);
          doc.moveDown(1);
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
  } else {
    msg = "Selecione um tipo de relatório.";
    res.render("relatorio", { msg });
  }
};
