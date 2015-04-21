var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserSchema = mongoose.model('Users');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
