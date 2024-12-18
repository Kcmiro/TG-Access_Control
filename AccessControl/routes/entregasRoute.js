const express = require("express");
const router = express.Router();
const nivel = require("../middleware/verificarNivelAcesso");

const entregasController = require("../controllers/entregascontroller");
const checkLogin = require("../middleware/checkLogin");

router.get("/entregascadastro", checkLogin, entregasController.mostrarEntregas);
router.post("/entregascadastro", checkLogin, entregasController.create);

router.get("/listarentregas", checkLogin, entregasController.getAll);

router.get("/editarentregas/:id", checkLogin, entregasController.getOne);
router.post("/editarentregas/:id", checkLogin, entregasController.update);

router.post(
  "/:id/excluir",
  checkLogin,
  nivel(["ADM"]),
  entregasController.delete
);

router.get("/consultarentregas", checkLogin, entregasController.getAllPatio);
router.get("/patioentregas/:id", checkLogin, entregasController.getOnePatio);

module.exports = router;
