const express = require("express");
const router = express.Router();
const nivel = require("../middleware/verificarNivelAcesso");
const checkLogin = require("../middleware/checkLogin");

const usuariosController = require("../controllers/usuariocontroller");

router.get("/login", usuariosController.mostrarlogin);
router.post("/login", usuariosController.login);

router.get("/perfil", checkLogin, usuariosController.mostrarAlterarSenha);
router.post("/perfil", checkLogin, usuariosController.alterarSenha);

router.get(
  "/novousuario",
  nivel(["ADM", "CFTV"]),
  usuariosController.mostrarCadastro
);
router.post(
  "/novousuario",
  checkLogin,
  nivel(["ADM"]),
  usuariosController.create
);

router.get(
  "/editarusuarios",
  checkLogin,
  nivel(["ADM"]),
  usuariosController.listarUsuarios
);
router.get(
  "/:id/excluir",
  checkLogin,
  nivel(["ADM"]),
  usuariosController.excluirUsuario
);

module.exports = router;
