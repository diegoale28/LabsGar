var express = require('express');
var router = express.Router();
var resultadoC = require('../controllers/resultadosC')

/* GET home page. */
router.get('/', function (req, res, next) {
  resultadoC.todos()
    .then((result) => {
      res.render('resultados', {
        titulo: 'Resultados',
        resultados: result.resultados,
        medicos: result.medicos,
        ordenes: result.ordenes,
        mensaje: result.mensaje,
        status:result.status
      })
      // res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  resultadoC.crear(req.body)
    .then((result) => {
      res.render('resultados', {
        titulo: 'Resultados',
        resultados: result.resultados,
        medicos: result.medicos,
        ordenes: result.ordenes,
        mensaje: result.mensaje,
        status:result.status
      })
      // res.send(result)
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;
