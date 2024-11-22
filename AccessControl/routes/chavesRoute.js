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

router.get("/listarchaves/", checkLogin, chaveController.getAll);

router.get("/editarchaves/:id", checkLogin, chaveController.getOne);
router.post("/editarchaves/:id", checkLogin, chaveController.update);
router.post("excluir/:id/excluir", checkLogin, chaveController.delete);

module.exports = router;
