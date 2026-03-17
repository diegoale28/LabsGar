var express = require('express');
var router = express.Router();
const clientesC = require('../controllers/clientesC')
var auth = require('../middleware/auth')

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  clientesC.todos()
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/uno', auth, function (req, res, next) {
  clientesC.uno(req.body.cedulaBuscar)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

router.post('/crear', auth, function (req, res, next) {
  clientesC.crear(req.body)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

router.put('/editar/:id', auth, function (req, res, next) {
  clientesC.editar(req.body, req.params.id)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

router.delete('/eliminar/:id', auth, function (req, res, next) {
  clientesC.eliminar(req.params.id)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

module.exports = router;
