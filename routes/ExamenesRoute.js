var express = require('express');
var router = express.Router();
var examenC = require('../controllers/examenC')
var auth = require('../middleware/auth')

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  examenC.todoExamen()
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

// router.get('/', auth, function (req, res, next) {
//   examenC.todoExamen()
//     .then((result) => {
//       res.status(result.status).json(result)
//     }).catch((err) => {
//       res.status(err.status).json(err)
//     });
// });

router.post('/crearInsumo', auth, function (req, res, next) {
  examenC.crearInsumo(req.body)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/buscar', auth, function (req, res, next) {
  examenC.unoExamen(req.body.nombreBuscar)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});


router.post('/uno', auth, function (req, res, next) {
  examenC.unoExamen(req.body.nombre)
    .then((result) => {
      res.send(result)
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.post('/crear', auth, function (req, res, next) {
  examenC.crearExamen(req.body)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.put('/editarExamen/:id', auth, function (req, res, next) {
  examenC.editarExamen(req.body, req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.put('/editarInsumo/:id', auth, function (req, res, next) {
  examenC.editarInsumo(req.body, req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status || 500).send(err)
    });
});

router.delete('/eliminarInsumo/:id', auth, function (req, res, next) {
  examenC.eliminarInsumo(req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminarExamen/:id', auth, function (req, res, next) {
  examenC.eliminarExamen(req.params.id)
    .then((result) => {
      res.render('examenes', {
        titulo: 'Examenes',
        insumos: result.insumos,
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
