var express = require('express');
var router = express.Router();
//var mail = require('../utils/mailer.js');

/* GET users listing. */
router.get('/', function(req, res) {
	new mail().sendMail('xyz@gmail.com', 'TEST', 'TEXT');
  res.send('respond with a resource');
});

module.exports = router;
