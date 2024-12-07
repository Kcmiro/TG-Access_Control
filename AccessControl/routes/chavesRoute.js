const express = require("express");
const router = express.Router();

const chaveController = require("../controllers/chavescontroller");
const rchaveController = require("../controllers/registrochavecontroller");
const checkLogin = require("../middleware/checkLogin");
const nivel = require("../middleware/verificarNivelAcesso");

router.get(
  "/chavescadastro",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  chaveController.mostrarChaves
);
router.post(
  "/chavescadastro",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  chaveController.create
);

router.get(
  "/registrochavecadastro",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  rchaveController.mostrarRChaves
);
router.post(
  "/registrochavecadastro",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  rchaveController.create
);

router.get(
  "/listarchaves/",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  chaveController.getAll
);

router.get(
  "/editarchaves/:id",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  chaveController.getOne
);
router.post(
  "/editarchaves/:id",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  chaveController.update
);
router.post(
  "/:id/excluir",
  checkLogin,
  nivel(["ADM", "CFTV"]),
  chaveController.delete
);

module.exports = router;
