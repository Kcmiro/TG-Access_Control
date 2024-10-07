const express = require("express");
const router = express.Router();

const genericasController = require("../controllers/genericascontroller");

router.get("", genericasController.home);

module.exports = router;
