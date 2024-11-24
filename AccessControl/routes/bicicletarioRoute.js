const express = require("express");
const router = express.Router();

const bicicletarioController = require("../controllers/bicicletariocontroller");
const checkLogin = require("../middleware/checkLogin");

router.get(
  "/bicicletariocadastro",
  checkLogin,
  bicicletarioController.mostrarBicicletas
);
router.post("/bicicletariocadastro", checkLogin, bicicletarioController.create);

router.get("/listarbicicletas", checkLogin, bicicletarioController.getAll);

router.get("/editarbicicletas/:id", checkLogin, bicicletarioController.getOne);
router.post("/editarbicicletas/:id", checkLogin, bicicletarioController.update);

router.post("/:id/excluir", checkLogin, bicicletarioController.delete);

module.exports = router;
