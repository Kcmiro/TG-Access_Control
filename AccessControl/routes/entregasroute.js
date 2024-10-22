const express = require("express");
const router = express.Router();

const entregasController = require("../controllers/entregascontroller");
const checkLogin = require("../middleware/checkLogin");

router.post("/", checkLogin, entregasController.create);
router.put("/", checkLogin, entregasController.update);
router.delete("/", checkLogin, entregasController.delete);
router.get("/", checkLogin, entregasController.getAll);
router.get("/:id", checkLogin, entregasController.getOne);

module.exports = router;