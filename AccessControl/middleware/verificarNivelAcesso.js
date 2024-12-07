function verificarNivelAcesso(niveisPermitidos) {
  return function (req, res, next) {
    // Acessar o usuário armazenado na sessão
    const usuario = req.session.Usuario;

    // Verificar se o usuário está logado e se o nível está entre os permitidos
    if (!usuario) {
      return res.render("login", { msg: "" }); // Retorna erro se não estiver autenticado
    }

    // Verificar se o nível do usuário está entre os níveis permitidos
    if (niveisPermitidos.includes(usuario.nivel)) {
      return next(); // Se permitido, continua para a próxima função (controlador)
    } else {
      const referer = req.get("Referer") || "/"; // Se não houver Referer, redireciona para a raiz

      // Redireciona de volta para a URL anterior, passando a mensagem
      res.redirect(`${referer}?msg=${encodeURIComponent("Acesso Negado")}`);
    }
  };
}

module.exports = verificarNivelAcesso;
