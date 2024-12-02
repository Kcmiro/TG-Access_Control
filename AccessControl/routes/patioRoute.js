const express = require("express");
const router = express.Router();

const patioController = require("../controllers/patiocontroller");
const entregasController = require("../controllers/entregascontroller");
const checkLogin = require("../middleware/checkLogin");

router.post("/:id", checkLogin, patioController.patioEntregas);

router.get("/patio", checkLogin, patioController.patio);

module.exports = router;
