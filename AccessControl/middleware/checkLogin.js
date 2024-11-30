function logado(req, res, next) {
  if (!req.session.Usuario) {
    res.render("login", { msg: "" });
  } else {
    req.Usuario = req.session.Usuario;
    next();
  }
}

module.exports = logado;
