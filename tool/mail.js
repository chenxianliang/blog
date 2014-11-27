var mailer = require('nodemailer');
var config = require('../config');

var transport = mailer.createTransport('SMTP', config.mail);

exports.sendMail = function(who, title, body) {
    if (config.debug) {
        return;
    }
    var options ={
    	from: config.from, // sender address
	    to: who, // list of receivers
	    subject: title, // Subject line
	    text: title, // plaintext body
	    html: body // html body
    }
    transport.sendMail(options, function(err) {
        if (err) {
            console.log(err);
        }else{
        	console.log('邮件发送成功！')
        }
    });
}