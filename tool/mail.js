var mailer = require('nodemailer');
var config = require('../config');
var url = config.url;


var transporter = mailer.createTransport(config.mail);

var to = config.to;
var sends = function(title, body) {
    if (config.debug) {
        return;
    }
    var mailOptions = {
        from: config.from, // sender address
        to: config.to, // list of receivers
        subject: title, // Subject line
        text: title, // plaintext body
        html:body // html body
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}


exports.replyMail = function(title, href, content) {
    var body = '<h1>当前有人对你对文章［' + title + '］发表了评论,请查看</h1><p><a href="' + href + '">点击查看</a></p><h2>评论内容:' + content + '</h2>';
    sends(title, body);
}

exports.msgMail = function(content) {
    var body = '<h1>有人给网站留言了</h1><p><a href="' + url + '">点击查看</a></p><h2>评论内容:' + content + '</h2>';
    sends('有人给网站留言了', body);
}