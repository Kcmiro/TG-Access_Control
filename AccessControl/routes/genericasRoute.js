const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const checkOut = require("../middleware/checkOut");
const router = express.Router();

const genericasController = require("../controllers/genericascontroller");

router.get("", checkLogin, genericasController.home);
router.get("/sair", checkOut, genericasController.sair);
router.get("/relatorio", checkLogin, genericasController.relatorio);
router.post("/relatorio", checkLogin, genericasController.relatorio);

module.exports = router;
