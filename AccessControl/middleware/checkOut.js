function deslogado(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Erro ao deslogar");
    }
    res.redirect("/"); // Redireciona após o logout
  });
}

module.exports = deslogado;
