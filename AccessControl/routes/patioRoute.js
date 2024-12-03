const express = require("express");
const router = express.Router();

const patioController = require("../controllers/patiocontroller");
const entregasController = require("../controllers/entregascontroller");
const checkLogin = require("../middleware/checkLogin");

router.post("/:id", checkLogin, patioController.patioEntregas);
router.post("/servicos/:id", checkLogin, patioController.patioServicos);
router.post("/bike/:id", checkLogin, patioController.patioBike);

router.get("/patio", checkLogin, patioController.patio);
router.post("/patio/:id", checkLogin, patioController.patioSaida);
module.exports = router;
