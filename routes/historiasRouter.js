var express = require('express');
var router = express.Router();
var historiaC = require('../controllers/historiaC')

/* GET home page. */
router.get('/', function (req, res, next) {
  historiaC.todos()
    .then((result) => {
      res.render('historias', {
        titulo: 'Hitorias',
        historias: result.historias,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno', function (req, res, next) {
  historiaC.uno(req.body.cedula)
    .then((result) => {
      res.render('historias', {
        titulo: 'Hitorias',
        historias: result.historias,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/detalle/:id', function (req, res, next) {
  historiaC.detalle(req.params.id)
    .then((result) => {
      res.render('detalleOrden', {
        titulo: 'Historias',
        ordenes: result.historias || [],
        mensaje: result.mensaje,
        status: result.status,
        panel: false,
        link:"/historias"
      })
      // res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;
