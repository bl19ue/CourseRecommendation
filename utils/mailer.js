//var express = require('express');
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
service: "Gmail",
auth: {
user: "sudhakar.kamanboina@gmail.com",
pass: ""
}
});

module.exports = function()
{ 

	this.sendMail = function(emailId, to, text) 
	{
		console.log('done');
		var mailOptions={
			to : emailId,
			subject : 'TEST',
			text : 'TEST'
		}
		console.log(mailOptions);

		smtpTransport.sendMail(mailOptions, function(error, response)
		{	
			if(error)
			{
				console.log(error);
				//res.end("error");
			}
			else
			{
				console.log("Message sent: " + response.message);
				//res.end("sent");
			}
		});
	};
}

//="mailer";