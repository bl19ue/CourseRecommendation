var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var q = require('q');

var CourseSchema = mongoose.model('Courses');

router.post('/recommend', function(req, res){
	console.log("----------------Recommending Courses------------------");
	reqData = JSON.parse(req.body.data)
	reqDataLength = reqData.length;
	//console.log(reqData);
	//console.log(reqData.length);
	var data = JSON.stringify(reqData);
	var result;
	if(reqDataLength<5){
		computeSkillArray(data, reqDataLength).then(function(skillArray){
			findCoursesforSkill(skillArray).then(function(result){
				console.log("===============Result============");	
				console.log("Results found: " + result.length);
				res.json({
					type: true,
					data: "Response"
				});
			});
		});

	}else{
		computeSkillArray(data, reqDataLength).then(function(skillArray){
			findCoursesforSkill(skillArray).then(function(result){
				console.log("===============Result============");	
				console.log("Results found: " + result.length);
				res.json({
					type: true,
					data: result
				});
			});
		});
	}

	
});

var computeSkillArray = function(reqData, len){
	//console.log("computeSkillArray(" + reqData + "," + len + ")");
	var skillData = JSON.parse(reqData);
	// console.log(skillData);
	//console.log(skillData[0]);
	var skillArray = [];
	var i =0;
	var deferred = q.defer();

	for(i=0; i<len; i){
		skill = skillData[i];
		// console.log(skill);
		skillCount = skill.count;
		// console.log(skill.count);
		var level;
		if(skillCount>=5){
			console.log(skill.skill + ' : ' + 'Expert');
		}else if(skillCount<5 && skillCount > 2){
			console.log(skill.skill + ' : ' + 'Intermediate');
			level = 3;
			skillArray.push({'skill' : skill.skill, 'level' : level});
			i++;
		}else if(skillCount==1){
			level = 2;
			console.log(skill.skill + ' : ' + 'Beginner');
			skillArray.push({'skill' : skill.skill, 'level' : level});
			i++;
		}else{
			level = 1;
			console.log(skill.skill + ' : ' + 'None');
			skillArray.push({'skill' : skill.skill, 'level' : level});
			i++;
		}	
	}

	deferred.resolve(skillArray);
	
	console.log("---------------------------skillArray--------------------------");
	console.log(JSON.stringify(skillArray));
	
	return deferred.promise;
}

function findCoursesforSkill(skillArray){
	var deferred2 = q.defer();
	var result = [];
	var count = 0;
	var recommendedCoursesLength = 0;
	skillArray.forEach(function(skill){
		console.log('Finding level#:'+  skill.level + ' courses for skill: ' + skill.skill);
		skillName = skill.skill.toLowerCase();
		CourseSchema.find({'skills': skillName, 'level': skill.level}, function(err, courses){
			//console.log(courses);
			if(err){
				console.log("Error: " + err);
				deferred2.reject(err);
			}else{
				if(courses.length!=0){
					recommendedCoursesLength += courses.length;
					console.log("---------courses found for " + skill.skill + " skill.");
					result.push({'skill' : skill.skill, 'level' : skill.level, 'courses': JSON.stringify(courses)});					
				}else{
					console.log("No course found for "  + skill.skill);
					//deferred2.reject("No course found");
				}
			}
			if(count == skillArray.length - 1){
				if(recommendedCoursesLength < 10){
					findMoreCourses(skillArray, result, recommendedCoursesLength).then(function(result){
						deferred2.resolve(result);
					});
				}else{
					deferred2.resolve(result);
				}
			}
			count++;
		});
	});

	return deferred2.promise;
}

var findMoreCourses = function(skillArray, result, recommendedCoursesLength){

	console.log("---------------------Finding more courses-----------------------");
	var deferred3 = q.defer();
	var count = 0;
	skillArray.forEach(function(skill){
		skillName = skill.skill.toLowerCase();
		CourseSchema.find({'skills': skillName}, function(err, courses){
			if(err){
				console.log("Error: " + err);
				deferred3.reject(err);
			}else{
				if(courses.length!=0){
					console.log("recommendedCoursesLength = " +recommendedCoursesLength );
					recommendedCoursesLength += courses.length;
					console.log("---------courses found for " + skill.skill + " skill.");
					result.push({'skill' : skill.skill, 'level' : skill.level, 'courses': JSON.stringify(courses)});					
				}else{
					console.log("No course found for "  + skill.skill);
					//deferred2.reject("No course found");
				}
			}
			if(recommendedCoursesLength > 10){
				deferred3.resolve(result);
			}
		});
	});
	return deferred3.promise;
}

module.exports = router;
//if count is greater than 5 than he is an expert
//if count is between 2 - 5 than he is an intermediate
//if count is less that 3 than he is an beginner