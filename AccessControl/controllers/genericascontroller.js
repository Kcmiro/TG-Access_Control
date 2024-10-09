exports.home = (req, res, next) => {
  if (!req.session.Usuario) {
    res.render("login", { msg: "" });
  } else {
    res.render("index");
  }
};
