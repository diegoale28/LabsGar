var jwt = require('jsonwebtoken');
require('dotenv').config()


function permisos(req, res, next) {
  const rol = req.body.rol || null
  if (!rol) {
    return res.status(401).json({ status: 401, mensaje: 'No autorizado. Token no proporcionado.' });
  }
  if (rol == 'ADMIN') {
    next();
  } else {
    return res.render('noAutorizado')
  }
}


module.exports = permisos;


