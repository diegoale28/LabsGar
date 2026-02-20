var express = require('express');
var router = express.Router();
var examenC = require('../controllers/examenC')

/* GET home page. */
router.get('/', function (req, res, next) {
  examenC.todoExamen()
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

// router.get('/', function (req, res, next) {
//   examenC.todoExamen()
//     .then((result) => {
//       res.status(result.status).json(result)
//     }).catch((err) => {
//       res.status(err.status).json(err)
//     });
// });

router.post('/crearInsumo', function (req, res, next) {
  examenC.crearInsumo(req.body)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/buscar', function (req, res, next) {
  examenC.unoExamen(req.body.nombreBuscar)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});


router.post('/uno', function (req, res, next) {
  examenC.unoExamen(req.body.nombre)
    .then((result) => {
      res.send(result)
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.post('/crear', function (req, res, next) {
  examenC.crearExamen(req.body)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.put('/editarExamen/:id', function (req, res, next) {
  examenC.editarExamen(req.body, req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.put('/editarInsumo/:id', function (req, res, next) {
  examenC.editarInsumo(req.body, req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.delete('/eliminarInsumo/:id', function (req, res, next) {
  examenC.eliminarInsumo(req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminarExamen/:id', function (req, res, next) {
  examenC.eliminarExamen(req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
