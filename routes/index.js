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



var getPopularity = function(coursesBySkills){
	var deferred = Q.defer();
	var length = Object.keys(coursesBySkills).length;
	var count = 0;
	console.log('length of courseBySkills:' + length);
	
	var popularCoursesBySkills = {};
	for(var skill in coursesBySkills){
		if(coursesBySkills.hasOwnProperty(skill)){
			
			var url = coursesBySkills[skill].url;
			
			fetchSharedCount(url).then(function(hits){
				
				popularCoursesBySkills.push({
					skill: skill,
					url: url,
					hits: hits
				});
				if(count == length - 1){
					deferred.resolve(popularCoursesBySkills);
				}
				count++;
			}).fail(function(err){
				console.log(err);
			});
		}
	}
	
	return deferred.promise;
}

var sharedCountUrl = "http://free.sharedcount.com/?url=";
var apikey = "apikey=922764bdfe8cedf35919617dc6a5d2a5fd09e8cd";

var fetchSharedCount = function(url){
	var deferred = Q.defer();
	var count = 0;
	var fullUrl = sharedCountUrl + url + "&" + apikey;
	request({
		url: fullUrl,
		json: true
	}, function(error, response, body){
		var length = Object.keys(body).length;
		console.log('length of body:' + length);
		console.log("in sharedcount");
		if(error){
			//console.log("error:" + error);
			return error;
		}
		else{
			var hits = 0;
			for(var socialMedia in body){
				//console.log(socialMedia);
				if(body.hasOwnProperty(socialMedia)){
					if(socialMedia != 'Facebook'){
						hits += body[socialMedia];
						//console.log(body[socialMedia]);
					}
					else{
						for(var facebookProperty in body[socialMedia]){
							hits += body[socialMedia][facebookProperty];
							//console.log('fb:' + body[socialMedia][facebookProperty]);
						}
					}
				}
				
				if(count == length - 1){
					deferred.resolve(hits);
				}
				
				count++;
			}

		}	
	});
	return deferred.promise;
}


module.exports = router;
