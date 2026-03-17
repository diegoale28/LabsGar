var express = require('express');
var router = express.Router();
var usuariosController = require('../controllers/usuariosC');
var auth = require('../middleware/auth')
var permisos = require('../middleware/permisos')
var logueado = require('../middleware/logueado')

/* GET users listing. */
router.get('/', auth, permisos, function (req, res, next) {
  usuariosController.roles()
    .then((result) => {
      res.render('registrarUsuario', {
        titulo: 'Registrar usuarios',
        roles: result.data,
        mensaje: null,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.render('errorServe', {
        status: 500,
        mensaje: err.mensaje
      })
    });
});

router.get('/lista', auth, permisos, function (req, res, next) {
  usuariosController.listaUsuarios()
    .then((result) => {
      res.render('listaUsuarios', {
        titulo: 'Lista de usuarios',
        usuarios: result.data,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.render('errorServe', {
        status: 500,
        mensaje: err.mensaje
      })
    });
});

router.get('/login', logueado, function (req, res, next) {
  res.render('login', {
    mensaje: '',
    status: 200
  })
});

router.post('/iniciar', function (req, res, next) {
  usuariosController.login(req.body)
    .then((result) => {
      if (result.status == 401) {
        res.render('login', {
          mensaje: result.mensaje,
          status: result.status
        })
      } else {
        res.cookie('token', result.token, { httpOnly: true });
        res.redirect('/');
      }
    }).catch((err) => {
      res.render('errorServe', {
        status: 500,
        mensaje: err.mensaje
      })
    });
});

router.post('/registro', auth, permisos, function (req, res, next) {
  usuariosController.registrar(req.body)
    .then((result) => {
      res.render('registrarUsuario', {
        titulo: 'Registrar usuarios',
        roles: result.roles,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.render('errorServe', {
        status: 500,
        mensaje: err.mensaje
      })
    });
});

router.get('/logout', function (req, res, next) {
  const token = req.cookies.token
  if (!token) {
    res.render('login', {
      mensaje: 'Aún no inicias sesión',
      status: 200
    })
  } else {
    res.clearCookie('token');
    res.redirect('/usuarios/login')
  }
});



module.exports = router;
