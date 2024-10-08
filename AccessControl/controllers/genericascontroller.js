exports.home = (req, res, next) => {
  if (!req.session.usuario) {
    res.render("login", { msg: "" });
  } else {
    res.render("index");
  }
};
