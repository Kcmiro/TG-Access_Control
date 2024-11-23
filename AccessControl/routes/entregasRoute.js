const express = require("express");
const router = express.Router();

const entregasController = require("../controllers/entregascontroller");
const checkLogin = require("../middleware/checkLogin");

router.get("/entregascadastro", checkLogin, entregasController.mostrarEntregas);
router.post("/entregascadastro", checkLogin, entregasController.create);

router.get("/listarentregas", checkLogin, entregasController.getAll);

router.get("/editarentregas/:id", checkLogin, entregasController.getOne);
router.put("/editarentregas/:id", checkLogin, entregasController.update);
router.post("/:id", checkLogin, entregasController.delete);

module.exports = router;
