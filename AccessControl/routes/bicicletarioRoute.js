const express = require("express");
const router = express.Router();

const bicicletarioController = require("../controllers/bicicletariocontroller");
const checkLogin = require("../middleware/checkLogin");
const nivel = require("../middleware/verificarNivelAcesso");

router.get(
  "/bicicletariocadastro",
  checkLogin,
  bicicletarioController.mostrarBicicletas
);
router.post("/bicicletariocadastro", checkLogin, bicicletarioController.create);

router.get("/listarbicicletas", checkLogin, bicicletarioController.getAll);

router.get("/editarbicicletas/:id", checkLogin, bicicletarioController.getOne);
router.post("/editarbicicletas/:id", checkLogin, bicicletarioController.update);

router.post(
  "/:id/excluir",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  bicicletarioController.delete
);

router.get(
  "/consultarbicicletas",
  checkLogin,
  bicicletarioController.getAllPatio
);
router.get(
  "/patiobicicletas/:id",
  checkLogin,
  bicicletarioController.getOnePatio
);

module.exports = router;
