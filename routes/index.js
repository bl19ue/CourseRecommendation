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

router.get('/user/:name/courses', function(req, res){
	var name = req.params.name;
	var num_result = 2;

	findUser(name).then(function(user){
		console.log(user.name);
		var skills = user.skills;
		if(skills == null){ return; }
		getCourses(skills, num_result).then(function(results){
			res.json({data:results});
			//respondData(res, results);

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

function findCourse(skill, max_results){
	var deferred = Q.defer();
	CourseSchema.find({$or: [{name: skill}, {about: skill}] }, {id:1, shortName:1, name:1} , function(err, courses) {
		if(err){
			deferred.reject(err);
		}
		else{
			var obj = {
				
			}
			//console.log(courses);
			deferred.resolve(courses);
		}
	}).limit(max_results);

	return deferred.promise;
} 

function getCourses(skills, max_results){
	var deferred = Q.defer();
	var results = [];
	var lengthOfSkills = skills.length;
	var count = 0;
	skills.forEach(function(skill){
		//Get the courses for this skill with limit set to [max_results]
		
		findCourse(skill, max_results).then(function(courses){
			console.log('skill:'+skill);
			results.push({
				skill : skill,
				courses : courses
			});
			if(count == lengthOfSkills - 1){
				deferred.resolve(results);			
			}
			count++;
		}).fail(function(err){
			console.log(err);
		});
		//deferred.resolve(results);
		//results.push(COURSES);
	});
	console.log('check results:' + results[0]);
	
	return deferred.promise;
}

function findUser(name){
	var deferred = Q.defer();
	UserSchema.findOne({name: name}, function(err, user){
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
