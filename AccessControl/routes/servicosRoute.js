const express = require("express");
const router = express.Router();

const servicoController = require("../controllers/servicoscontoller");
const checkLogin = require("../middleware/checkLogin");

router.get("/servicoscadastro", checkLogin, servicoController.mostrarServicos);
router.post("/servicoscadastro", checkLogin, servicoController.create);

router.get("/listarservicos", checkLogin, servicoController.getAll);

router.get("/editarservicos/:id", checkLogin, servicoController.getOne);
router.post("/editarservicos/:id", checkLogin, servicoController.update);

router.post("/:id/excluir", checkLogin, servicoController.delete);

router.get("/consultarservicos", checkLogin, servicoController.getAllPatio);
router.get("/patioservicos/:id", checkLogin, servicoController.getOnePatio);

module.exports = router;
