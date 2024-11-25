const express = require("express");
const checklogin = require("../middleware/checkLogin");
const checkOut = require("../middleware/checkOut");
const router = express.Router();

const genericasController = require("../controllers/genericascontroller");

router.get("", checklogin, genericasController.home);
router.get("/sair", checkOut, genericasController.sair);
router.get("/relatorio", checklogin, genericasController.relatorio);
router.post("/relatorio", checklogin, genericasController.relatorio);

module.exports = router;
