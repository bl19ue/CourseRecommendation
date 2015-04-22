var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Q = require('q');

var UserSchema = mongoose.model('Users');
var CourseSchema = mongoose.model('Courses');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/user/:userid/courses', function(req, res){
	var userid = req.params.userid;
	
	
});

function findUser(userid){
	var deferred = Q.defer();
	UserSchema.findOne({userid: userid}, function(err, user){
		if(err){
			deferred.reject(err);
		}
		else{
			if(user){
				deferred.resolve(user);
			}
			else{
				deferred.reject("No user found");
			}
		}
	});

	return deferred.promise;
}

module.exports = router;
