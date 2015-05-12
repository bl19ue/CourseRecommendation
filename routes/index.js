var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Q = require('q');
var request = require("request")

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

router.get('/mycourses', function(req, res){
	var obj = [
		{
			skill: "Java",
			courses: [
				{
					name: "Advanced Java",
					url: "http://www.facebook.com"
				},
				{
					name: "Core Java",
					url: "http://www.google.com"
				}
			]
		}, 
		{
			skill: "Android",
			courses: [
				{
					name: "Advanced Android",
					url: "http://www.amazon.com"
				},
				{
					name: "Core Android",
					url: "http://www.yahoo.com"
				}
			]
		},
		{
			skill: "iOS",
			courses: [
				{
					name: "Advanced iOS",
					url: "http://www.apple.com"
				},
				{
					name: "Core iOS",
					url: "http://www.nike.com"
				}
			]
		}
	];
	console.log(obj);
	attachPopularity(obj).then(function(newCourseBySkills){
		respondData(res, newCourseBySkills);
	}).fail(function(err){
		console.log(err);
	});
});

var attachPopularity = function(coursesBySkills){
	var count = 0;
	var deferred = Q.defer();
	var newCourseBySkills = [];
	var length = coursesBySkills.length;
	coursesBySkills.forEach(function(oneSkillCourses){
		attachHitsToCourses(oneSkillCourses).then(function(courses){
			console.log('courses in one skill:' + courses);
			newCourseBySkills.push({
				skill : oneSkillCourses.skill,
				courses : courses
			});
			if(count == length - 1){
				deferred.resolve(newCourseBySkills);
			}
			count++;
		}).fail(function(err){
			console.log(err);
			deferred.reject(err);
		});

	});

	return deferred.promise;
}

var attachHitsToCourses = function(oneSkillCourses){
	var count = 0;	
	var deferred = Q.defer();
	var length = oneSkillCourses.courses.length;
	var courses = [];

	oneSkillCourses.courses.forEach(function(course){
		var url = course.url;
		fetchSharedCount(url).then(function(popularity){
			console.log('popularity of course:' + course.name + " " + popularity);
			courses.push({
				details: course,
				popularity: popularity
			});

			if(count == length - 1){
				deferred.resolve(courses);
			}
			count++;
		}).fail(function(err){
			console.log(err);
			return err;
		});
	});

	return deferred.promise;
}

var rankCourses = function(coursesBySkills){
	getPopularity(coursesBySkills).then(function(hitsByCourse){

	}).fail(function(err){
		console.log(err);
	});
}

var filterTopUrls = function(coursesBySkills, hitsByCourses){
	coursesBySkills.forEach(function(oneSkillCourse){

	});
};

var getPopularity = function(coursesBySkills){

	var courseHits = [];
	var length = Object.keys(coursesBySkills).length;
	console.log('length of courseBySkills:' + length);
	var count = 0;
	var deferred = Q.defer();
	coursesBySkills.forEach(function(oneSkillCourse){
		oneSkillCourse.courses.forEach(function(course){
			var url = course.url;
			fetchSharedCount(url).then(function(hits){

				courseHits.push({
					url: url,
					hits: hits
				});
				if(count == length - 1){
					deferred.resolve(courseHits);
				}
				count++;
			}).fail(function(err){
				console.log(err);
				deferred.reject(err);
			});
		});
	});

	return deferred.promise;
}

var sharedCountUrl = "http://free.sharedcount.com/?url=";
var apikey = "apikey=922764bdfe8cedf35919617dc6a5d2a5fd09e8cd";

var fetchSharedCount = function(url){
	var deferred = Q.defer();
	var count = 0;
	var fullUrl = sharedCountUrl + url + "&" + apikey;
	var popularity = {};
	request({
		url: fullUrl,
		json: true
	}, function(error, response, body){
		var length = Object.keys(body).length;
		console.log('length of body:' + length);
		console.log("in sharedcount");
		if(error){
			//console.log("error:" + error);
			deferred.reject(error);
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
					popularity.body = body;
					popularity.hits = hits;

					deferred.resolve(popularity);
				}

				count++;
			}

		}	

	});

	return deferred.promise;

}


module.exports = router;
