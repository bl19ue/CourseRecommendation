var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
	id:String,
	shortName:String,
	name:String,
	about: [{type: String}],
	url: String,
	skills:[],
	level: {type: Number, enum: [1,2,3]} //1: begineer, 2:intermediate, 3: expert
});

mongoose.model('Courses', CourseSchema, 'Courses');