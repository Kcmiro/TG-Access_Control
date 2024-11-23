const express = require("express");
const router = express.Router();

const servicoController = require("../controllers/servicoscontoller");
const checkLogin = require("../middleware/checkLogin");

router.get("/servicoscadastro", checkLogin, servicoController.mostrarServicos);
router.post("/servicoscadastro", checkLogin, servicoController.create);

router.get("/listarservicos", checkLogin, servicoController.getAll);

router.put("/:id", checkLogin, servicoController.update);
router.delete("/:id", checkLogin, servicoController.delete);
router.get("/:id", checkLogin, servicoController.getOne);

module.exports = router;
