var express = require('express');
var router = express.Router();
var ordenesC = require('../controllers/ordenesC')

/* GET home page. */
router.get('/', function (req, res, next) {
  ordenesC.todos()
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/completas', function (req, res, next) {
  ordenesC.filtros('completado')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/pendientes', function (req, res, next) {
  ordenesC.filtros('pendiente')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/procesando', function (req, res, next) {
  ordenesC.filtros('procesando')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/canceladas', function (req, res, next) {
  ordenesC.filtros('cancelado')
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.get('/uno/:id', function (req, res, next) {
  ordenesC.uno(req.params.id)
    .then((result) => {
      res.render('detalleOrden', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        mensaje: result.mensaje,
        status: result.status,
        panel: true,
        link:'/ordenes'
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.put('/cambiar/:id', function (req, res, next) {
  ordenesC.cambiar(req.body.estado, req.params.id)
    .then((result) => {
      res.render('detalleOrden', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        mensaje: result.mensaje,
        status: result.status,
        panel: true,
        link:'/ordenes'
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  ordenesC.crear(req.body)
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.put('/editar/:id', function (req, res, next) {
  ordenesC.editar(req.body, req.params.id)
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

router.delete('/eliminar/:id', function (req, res, next) {
  ordenesC.eliminar(req.params.id)
    .then((result) => {
      res.render('ordenes', {
        titulo: 'Lista de ordenes',
        ordenes: result.ordenes || [],
        clientes: result.clientes || [],
        enfermeros: result.enfermeros || [],
        examenes: result.examenes,
        mensaje: result.mensaje,
        status: result.status
      })
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;
