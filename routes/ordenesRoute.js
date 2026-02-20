var express = require('express');
var router = express.Router();
var ordenesC = require('../controllers/ordenesC')

/* GET home page. */
router.get('/', function (req, res, next) {
  ordenesC.todos()
    .then((result) => {
      // res.render('doctores', {
      //   titulo: 'Doctores',
      //   doctores: result.data,
      //   mensaje: result.mensaje,
      //   status: result.status
      // })
      res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno', function (req, res, next) {
  ordenesC.uno(req.body.numero)
    .then((result) => {
      // res.render('doctores', {
      //   titulo: 'Doctores',
      //   doctores: result.data,
      //   mensaje: result.mensaje,
      //   status: result.status
      // })
      res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  ordenesC.crear(req.body)
    .then((result) => {
      // res.render('doctores', {
      //   titulo: 'Doctores',
      //   doctores: result.data,
      //   mensaje: result.mensaje,
      //   status: result.status
      // })
      res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

router.put('/editar/:id', function (req, res, next) {
  ordenesC.editar(req.body, req.params.id)
    .then((result) => {
      // res.render('doctores', {
      //   titulo: 'Doctores',
      //   doctores: result.data,
      //   mensaje: result.mensaje,
      //   status: result.status
      // })
      res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

router.delete('/eliminar/:id', function (req, res, next) {
  ordenesC.eliminar(req.params.id)
    .then((result) => {
      // res.render('doctores', {
      //   titulo: 'Doctores',
      //   doctores: result.data,
      //   mensaje: result.mensaje,
      //   status: result.status
      // })
      res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;
