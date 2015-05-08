var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CourseSchema = mongoose.model('Courses');

var request = require("request")

var exports = module.exports = {};

var required_categories= ['cs-programming', 'cs-systems', 'stats'];

var categoriesUrl = "https://api.coursera.org/api/catalog.v1/categories?includes=courses";

var url = "https://api.coursera.org/api/catalog.v1/courses?fields=aboutTheCourse,language";

var courseid_phase1 = new Set();

//Not to be used for now
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

//Not to be used for now
router.get('/test', function(req, res) {
	var skill = "Java";
	CourseSchema.find({$or: [{name: {$regex: skill}}, {about: {$regex: skill}}] } , function(err, courses) {
		console.log(courses);
		res.json({
			data:courses
		});
	});

}); 



//Generic function to call any URL on coursera
var reqURL = function(callback){
	
	request({
		url: categoriesUrl,
		json: true
	}, callback(error, response, body));
	
}

//Phase I for category fetching that exist in req categories array
var fetchCategories = function(error, response, body){
	
	//If no error
	if (!error && response.statusCode === 200) {
		//For each category that exists on coursera
		body.elements.forEach(function(category){
			//Get only those which are required
			if(required_categories.contains(category.shortName)){
				//For each course in that particular category
				category.links.courses.forEach(function(courseid){
					//Add that cours id into phase 1 course list
					courseid_phase1.add(courseid);
				});
				
			}
		});
		
	}
}

//Get all those courses that exist in the required categories
var fetchCourses = function(err, response, body){
	//Check if any error
	if (!error && response.statusCode === 200) {
		//For each courses
		body.elements.forEach(function(course){
			//Check if its in english and also if its id exists in the courses_phase1
			if(courseid_phase1.contains(course.id) && course.language == "en"){
				//create the course
				var newData = new CourseSchema({
					id:	course.id,
					shortName:	course.shortName,
					name:	course.name,
					about:	course.aboutTheCourse,
					url: "https://www.coursera.org/course/" + course.shortName
				});
				//save it
				newData.save(function(err) {
					if (err) throw err;
				});
			}
		});
	}
}

exports.FetchAllCourses = function(){
	reqURL(fetchCategories);
}

//REST APIs here
//e.g. router.get('/courses', function(req, res){});

module.exports = router;