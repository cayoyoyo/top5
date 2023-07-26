module.exports = (req, res, next) => {
  // Verifica si el usuario está logueado
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  }

  // Si el usuario está logueado, establece 'currentUser' en la respuesta local
  res.locals.currentUser = req.session.currentUser;
  next();
};