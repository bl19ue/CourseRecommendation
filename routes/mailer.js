var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "systemgenerated007@gmail.com",
        pass: "systemgenerated"
    }
});

//module.exports = function()
router.post("/email", function(req, res) {

    console.log('email api called');
    var mailOptions = {
        to: req.body.emailId,
        subject: 'Hi, we have recommended courses for you',
        text: req.body.body
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.json({type: false, status:"mail not sent - " + error});
            
            //res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.json({type: true, status:"mail sent"});
            //res.end("sent");
        }
    });
});

module.exports = router;
//="mailer";