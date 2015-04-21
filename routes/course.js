var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserSchema = mongoose.model('Courses');

//REST APIs here
//e.g. router.get('/courses', function(req, res){});

module.exports = router;