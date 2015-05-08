var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
	id:String,
	shortName:String,
	name:String,
	about: [{type: String}],
	url: String
});

mongoose.model('Courses', CourseSchema, 'Courses');