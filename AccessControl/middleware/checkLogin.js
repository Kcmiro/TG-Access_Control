function logado(req, res, next) {
  if (!req.session.Usuario) {
    res.render("login", { msg: "" });
  } else {
    next();
  }
}

module.exports = logado;
