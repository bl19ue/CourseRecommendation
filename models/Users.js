var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	userid: String,
	name: String,
	skills: [{type: String}]
});

mongoose.model('Users', UserSchema, 'Users');



















