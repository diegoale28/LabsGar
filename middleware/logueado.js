var jwt = require('jsonwebtoken');
require('dotenv').config()


function logeado(req, res, next) {
  const token = req.cookies.token || null;
  if (!token) {
    next()
  } else {
    res.redirect('/')
  }
  
}


module.exports = logeado;