const express = require("express");
const router = express.Router();

const servicoController = require("../controllers/servicoscontoller");
const checkLogin = require("../middleware/checkLogin");

router.post("/servicoscadastro", checkLogin, servicoController.create);
router.put("/:id", checkLogin, servicoController.update);
router.delete("/:id", checkLogin, servicoController.delete);
router.get("/", checkLogin, servicoController.getAll);
router.get("/:id", checkLogin, servicoController.getOne);

module.exports = router;
