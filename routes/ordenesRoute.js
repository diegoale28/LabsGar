var express = require('express');
var router = express.Router();
var ordenesC = require('../controllers/ordenesC');
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  ordenesC.todos()
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/completas', auth, function (req, res, next) {
  ordenesC.filtros('completado')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/pendientes', auth, function (req, res, next) {
  ordenesC.filtros('pendiente')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/procesando', auth, function (req, res, next) {
  ordenesC.filtros('procesando')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/canceladas', auth, function (req, res, next) {
  ordenesC.filtros('cancelado')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/uno/:id', auth, function (req, res, next) {
  ordenesC.uno(req.params.id)
    .then((result) => {
      res.render('detalleOrden', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol,
        panel: true,
        link:'/ordenes'
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.put('/cambiar/:id', auth, function (req, res, next) {
  ordenesC.cambiar(req.body.estado, req.params.id)
    .then((result) => {
      res.render('detalleOrden', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol,
        panel: true,
        link:'/ordenes'
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', auth, function (req, res, next) {
  ordenesC.crear(req.body)
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.put('/editar/:id', auth, function (req, res, next) {
  ordenesC.editar(req.body, req.params.id)
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.delete('/eliminar/:id', auth, function (req, res, next) {
  ordenesC.eliminar(req.params.id)
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status,
        rol: req.body.rol
      })
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;
