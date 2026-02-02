var express = require('express');
var router = express.Router();
const examenC = require('../controllers/examenC')

/* GET home page. */
router.get('/', function(req, res, next) {
  examenC.todos()
  .then((result) => {
      res.status(result.status).json(result)
  }).catch((err) => {
      res.status(err.status).json(err)
  });
});

router.get('/uno/:id', function(req, res, next) {
  examenC.uno(req.params.id)
  .then((result) => {
      res.status(result.status).json(result)
  }).catch((err) => {
      res.status(500).send(err)
  });
});

router.post('/crear', function(req, res, next) {
  examenC.crear(req.body)
  .then((result) => {
      res.status(result.status).json(result)
  }).catch((err) => {
      res.status(500).send(err)
  });
});

router.post('/precio', function(req, res, next) {
  examenC.precio(req.body)
  .then((result) => {
      res.status(result.status).json(result)
  }).catch((err) => {
      res.status(500).send(err)
  });
});

router.post('/crear', function(req, res, next) {
  examenC.crear(req.body)
  .then((result) => {
      res.status(result.status).json(result)
  }).catch((err) => {
      res.status(500).send(err)
  });
});

router.put('/editar/:id', function(req, res, next) {
  examenC.editar(req.body, req.params.id)
  .then((result) => {
      res.status(result.status).json(result)
  }).catch((err) => {
      res.status(500).send(err)
  });
});

router.delete('/eliminar/:id', function(req, res, next) {
  examenC.eliminar(req.params.id)
  .then((result) => {
      res.status(result.status).json(result)
  }).catch((err) => {
      res.status(500).send(err)
  });
});

module.exports = router;
