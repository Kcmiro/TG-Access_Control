const express = require("express");
const router = express.Router();

const chaveController = require("../controllers/chavescontroller");
const rchaveController = require("../controllers/registrochavecontroller");
const checkLogin = require("../middleware/checkLogin");

router.get("/chavescadastro", checkLogin, chaveController.mostrarChaves);
router.post("/chavescadastro", checkLogin, chaveController.create);

router.get(
  "/registrochavecadastro",
  checkLogin,
  rchaveController.mostrarRChaves
);
router.post("/registrochavecadastro", checkLogin, rchaveController.create);

router.put("/:id", checkLogin, chaveController.update);
router.delete("/:id", checkLogin, chaveController.delete);
router.get("/", checkLogin, chaveController.getAll);
router.get("/:id", checkLogin, chaveController.getOne);

module.exports = router;
