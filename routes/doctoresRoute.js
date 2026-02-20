var express = require('express');
var router = express.Router();
var doctoresC = require('../controllers/doctoresC')

/* GET home page. */
router.get('/', function (req, res, next) {
  doctoresC.todos()
    .then((result) => {
      res.render('doctores', {
        titulo: 'Doctores',
        doctores: result.data,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno', function (req, res, next) {
  doctoresC.uno(req.body.especialidad)
    .then((result) => {
      res.render('doctores', {
        titulo: 'Doctores',
        doctores: result.data,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  doctoresC.crear(req.body)
    .then((result) => {
      res.render('doctores', {
        titulo: 'Doctores',
        doctores: result.data,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.put('/editar/:id', function (req, res, next) {
  doctoresC.editar(req.body, req.params.id)
    .then((result) => {
      res.render('doctores', {
        titulo: 'Doctores',
        doctores: result.data,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.delete('/eliminar/:id', function (req, res, next) {
  doctoresC.eliminar(req.params.id)
    .then((result) => {
      res.render('doctores', {
        titulo: 'Doctores',
        doctores: result.data,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;
