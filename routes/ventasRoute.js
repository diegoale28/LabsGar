var express = require('express');
var router = express.Router();
var ventasC = require('../controllers/ventasC');
const auth = require('../middleware/auth');
/* GET home page. */
router.get('/', auth, function (req, res, next) {
  ventasC.ordenes()
    .then((result) => {
      res.render('ventas', {
        titulo: 'Ventas',
        ordenes: result.data || [],
        mensaje:result.mensaje,
        status:result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', auth, function (req, res, next) {
  ventasC.crear(req.body)
    .then((result) => {
      res.render('ventas', {
        titulo: 'Ventas',
        ordenes: result.data || [],
        mensaje:result.mensaje,
        status:result.status,
        rol: req.body.rol
      });
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;