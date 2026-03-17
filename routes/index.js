var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  res.render('index', { titulo: 'Inicio', rol: req.body.rol });
});

module.exports = router;
