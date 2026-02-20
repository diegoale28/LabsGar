var express = require('express');
var router = express.Router();
var ventasC = require('../controllers/ventasC')
/* GET home page. */
router.get('/', function (req, res, next) {
  ventasC.ordenes()
    .then((result) => {
      res.render('ventas', {
        titulo: 'Ventas',
        ordenes: result.data || [],
        mensaje:result.mensaje,
        status:result.status
      });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  ventasC.crear(req.body)
    .then((result) => {
      res.render('ventas', {
        titulo: 'Ventas',
        ordenes: result.data || [],
        mensaje:result.mensaje,
        status:result.status
      });
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;