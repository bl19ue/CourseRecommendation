var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CourseSchema = mongoose.model('Courses');

var request = require("request")

var url = "https://api.coursera.org/api/catalog.v1/courses?fields=aboutTheCourse,language";



router.get('/', function(req, res) {
	var dataurl ='';
	console.log("in data url "+url);
	request({
		url: url,
		json: true
	}, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			for(var i=0;i<body.elements.length;i++){
				//console.log(body.elements[i]); // Print the json response
				console.log(body.elements[i].language);
				if(body.elements[i].language == "en"){
					var newData= new CourseSchema({id:	body.elements[i].id,
												   shortName:	body.elements[i].shortName,
												   name:	body.elements[i].name,
												   about:	body.elements[i].aboutTheCourse.split(" ")});
					newData.save(function(err) {
						if (err) throw err;
						
						
					});
					//console.log('Added!' + i);
				}

			}

			res.end();

		}
	})
	//
});

router.get('/test', function(req, res) {
	var skill = "Java";
	CourseSchema.find({$or: [{name: {$regex: skill}}, {about: {$regex: skill}}] } , function(err, courses) {
		console.log(courses);
		res.json({
			data:courses
		});
	});

}); 


//REST APIs here
//e.g. router.get('/courses', function(req, res){});

module.exports = router;