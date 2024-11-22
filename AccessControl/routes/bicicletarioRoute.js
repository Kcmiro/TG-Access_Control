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

router.put("/:id", checkLogin, bicicletarioController.update);
router.delete("/:id", checkLogin, bicicletarioController.delete);
router.get("/", checkLogin, bicicletarioController.getAll);
router.get("/:id", checkLogin, bicicletarioController.getOne);

module.exports = router;
