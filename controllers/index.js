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


exports.showIndex = function(req, res) {
    var once = require('../settings').topic_page_count;
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;

    var options = {
        skip: (page - 1) * once,
        limit: once,
        sort: '-top -last_reply_at'
    };

    Topic.getTopicsByQuery({}, options, function(err, docs) {
        Topic.getCountByQuery({}, function(err, count) {
            res.render('index.html', {
                title: '首页',
                topics: docs,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: Math.ceil(count/once) == page,
                pageCount:Math.ceil(count/once),
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        })
    })
}
