const express = require("express");
const checklogin = require("../middleware/checkLogin");
const router = express.Router();

const genericasController = require("../controllers/genericascontroller");

router.get("", checklogin, genericasController.home);
router.get("/relatorio", checklogin, genericasController.relatorio);
router.post("/relatorio", checklogin, genericasController.relatorio);

module.exports = router;
