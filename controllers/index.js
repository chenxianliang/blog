var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Reply = require('../proxy/reply');

exports.showAdmin = function(req, res) {
    res.render('admin/index.html', {
        title: 'cZone管理平台',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}


exports.showIndex = function(req,res){
	Topic.getTopicsByQuery({},'',function(err,docs){
		res.render('index.html', {
            title: '首页',
            topics: docs,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
	})
}
