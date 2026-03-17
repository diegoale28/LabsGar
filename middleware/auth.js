var jwt = require('jsonwebtoken');
require('dotenv').config()


function auth(req, res, next) {
  const token = req.cookies.token || null;
  if (!token) {
    return res.render('errorAutorizado')
  }
  try {
    const verificado = jwt.verify(token, process.env.SECRET)
    req.body.user_id_token = verificado.id
    req.body.rol = verificado.rol
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token no válido" });
  }
}


module.exports = auth;


