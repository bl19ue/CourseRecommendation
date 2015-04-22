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

router.get('/user/:userid/courses/:numresult', function(req, res){
	var userid = req.params.userid;
	var num_result = req.params.numresult;
	
	findUser().then(function(user){
		
		var skills = user.skills;
		
		getCourses(skills, num_result).then(function(result){
			
			respondData(res, result);
			
		}).fail(function(err){
			
			console.log(err);
			
		});
		
	}).fail(function(err){
		
		console.log(err);
		
	});
});

function respondData(res, data){
	res.json({
		type: true,
		data: data
	});
}

function getCourses(skills, max_results){
	var deferred = Q.defer();
	var results = [];
	
	skills.forEach(function(skill){
		//Get the courses for this skill with limit set to [max_results]
		
		//results.push(COURSES);
	});
	deferred.resolve(results);
	return deferred.promise;
}

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
