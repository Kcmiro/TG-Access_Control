const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuariocontroller");

router.get("/login", usuariosController.mostrarlogin);
router.post("/login", usuariosController.login);

router.get("/novousuario", usuariosController.mostrarCadastro);
router.post("/novousuario", usuariosController.create);

module.exports = router;
