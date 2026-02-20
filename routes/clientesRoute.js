var express = require('express');
var router = express.Router();
const clientesC = require('../controllers/clientesC')

/* GET home page. */
router.get('/', function (req, res, next) {
  clientesC.todos()
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      console.log(err)
      res.status(err.status).json(err)
    });
});

router.post('/uno', function (req, res, next) {
  clientesC.uno(req.body.cedulaBuscar)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

router.post('/crear', function (req, res, next) {
  clientesC.crear(req.body)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

router.put('/editar/:id', function (req, res, next) {
  clientesC.editar(req.body, req.params.id)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

router.delete('/eliminar/:id', function (req, res, next) {
  clientesC.eliminar(req.params.id)
    .then((result) => {
      res.render('clientes', {
        titulo: 'Clientes',
        clientes: result.data,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).send(err)
    });
});

module.exports = router;
