var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var q = require('q');

var CourseSchema = mongoose.model('Courses');

router.post('/recommend', function(req, res){
	console.log("Recommending Courses");
	reqData = JSON.parse(req.body.data)
	reqDataLength = reqData.length;
	//console.log(reqData);
	//console.log(reqData.length);
	var data = JSON.stringify(reqData);
	if(reqDataLength<5){
		computeSkillArray(data, reqData.length).then(function(skillArray){
			console.log(skillArray);
			res.json({
				type: true,
				data: "Response"
			});
		});

	}else{
		computeSkillArray(data, 5).then(function(skillArray){
			console.log(skillArray);
			res.json({
				type: true,
				data: "Response"
			});
		});
	}

	
});

var computeSkillArray = function(reqData, len){
	console.log("computeSkillArray(" + reqData + "," + len + ")");
	var skillData = JSON.parse(reqData);
	console.log(skillData);
	//console.log(skillData[0]);
	var skillArray = [];
	var i =0;
	var deferred = q.defer();

	for(i=0; i<len; i){
		skill = skillData[i];
	// skillData.foreach(function(skill){
		console.log(skill);
		skillCount = skill.count;
		console.log(skill.count);
		if(skillCount>=5){
			console.log(skill.skill + ' : ' + 'Expert');
		}else if(skillCount<5 && skillCount > 2){
			console.log(skill.skill + ' : ' + 'Intermediate');
			skillArray.push({'skill' : skill.skill, 'level' : 'Intermediate'});
			i++;
		}else if(skillCount==1){
			console.log(skill.skill + ' : ' + 'Beginner');
			skillArray.push({'skill' : skill.skill, 'level' : 'Beginner'});
			i++;
		}else{
			console.log(skill.skill + ' : ' + 'Beginner');
			skillArray.push({'skill' : skill.skill, 'level' : 'Beginner'});
			i++;
		}
	// });
	}
	
	deferred.resolve(skillArray);

	return deferred.promise;
}

module.exports = router;
//if count is greater than 5 than he is an expert
//if count is between 2 - 5 than he is an intermediate
//if count is less that 3 than he is an beginner