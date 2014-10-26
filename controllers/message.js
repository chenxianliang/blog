var Message = require('../proxy/message');
var models = require('../models');
var getTime = require('../tool/getTime');
var EventProxy = require('eventproxy');
var iphelp = require('../tool/ip');


exports.blist = function(req,res){
	var once = require('../settings').adminPage;
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var keyword = req.query.keyword ? req.query.keyword : '';

    var options = {
        skip: (page - 1) * once,
        limit: once,
        sort: '-create_at.date'
    };

    var query = {};

    if (keyword) {
        query['content'] = new RegExp(keyword); //模糊查询参数
    }

    var proxy = new EventProxy();

    proxy.all('message',function(message){
        res.render('admin/messageList.html', {
            title: '评论列表',
            messages: message,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    Message.getMessageByQuery(query, options, function(err, docs) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('back');
        }
        proxy.emit('message',docs);
    });

}

exports.ajaxAdd = function(req,res){
	var content = req.body.content.replace(/\</g,'&lt').replace(/\>/g,'&gt').trim() || '',
        author = req.body.author || '',
        ip = iphelp.getip(req)[0];

    if (content == '' || ip == '' || author == '') {
        var out = {
            status: 1010,
            msg: '必要内容不能为空!'
        };
        return res.send(out);
    }

    var proxy = new EventProxy();

    proxy.all('message',function(message){
        var out = {
            status: 1000,
            msg: message
        };
        res.send(out);
    });

    Message.newAndSave(content, ip, author, function(err, message) {
        if (err) {
            var out = {
	            status: 1010,
	            msg: '评论失败'
	        };
	        return res.send(out);
        }
        proxy.emit('message',message);
    });
}