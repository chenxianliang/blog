var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Reply = require('../proxy/reply');
var Cls = require('../proxy/cls');
var Message = require('../proxy/message');

var EventProxy = require('eventproxy');

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
    var keyword = req.query.keyword ? req.query.keyword : '';
    var queryDate = req.params.date;

    var options = {
        skip: (page - 1) * once,
        limit: once,
        sort: '-create_at.date'
    };

    var query = {};

    if (keyword) {
        query['title'] = new RegExp(keyword); //模糊查询参数
    }

    if (queryDate) {
        query['create_at.month'] = queryDate;
    }

    var proxy = new EventProxy();
    proxy.all('cls', 'topic', 'count', 'group', 'message', function(cls, topic, count, group, message) {
        res.render('index.html', {
            title: '首页',
            topics: topic,
            cls: cls,
            message: message,
            keyword: keyword,
            group: group,
            isHome: true,
            tab: null,
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: Math.ceil(count / once) == page,
            pageCount: Math.ceil(count / once),
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    Message.getMessageByQuery({}, {
        limit: 10
    }, function(err, message) {
        proxy.emit('message', message);
    });

    Topic.getTopicsByQuery({}, {}, function(err, docs) {
        var group = {};
        docs.forEach(function(doc) {
            if (group[doc.create_at.month]) {
                group[doc.create_at.month] ++;
            } else {
                group[doc.create_at.month] = 1;
            }
        });
        proxy.emit('group', group);
    });


    Topic.getTopicsByQuery(query, options, function(err, docs) {
        proxy.emit('topic', docs);
    });

    Topic.getCountByQuery(query, function(err, count) {
        proxy.emit('count', count);
    });

    Cls.getClsByQuery({}, function(err, cls) {
        proxy.emit('cls', cls);
    });
}


exports.showIndex_tab = function(req, res) {
    var once = require('../settings').topic_page_count;
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var keyword = req.query.keyword ? req.query.keyword : '';

    var clsName = req.params.clsName;

    var options = {
        skip: (page - 1) * once,
        limit: once,
        sort: '-create_at.date'
    };

    var query = {};

    if (keyword) {
        query['title'] = new RegExp(keyword); //模糊查询参数
    }


    var proxy = new EventProxy();
    proxy.all('cls', 'topic', 'count', 'group', 'message', function(cls, topic, count, group, message) {
        res.render('index.html', {
            title: '首页',
            topics: topic,
            page: page,
            cls: cls,
            message: message,
            keyword: keyword,
            group: group,
            isHome: false,
            tab: clsName,
            isFirstPage: (page - 1) == 0,
            isLastPage: Math.ceil(count / once) == page,
            pageCount: Math.ceil(count / once),
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    Topic.getTopicsByQuery({}, {}, function(err, docs) {
        var group = {};
        docs.forEach(function(doc) {
            if (group[doc.create_at.month]) {
                group[doc.create_at.month] ++;
            } else {
                group[doc.create_at.month] = 1;
            }
        });
        proxy.emit('group', group);
    });

    Message.getMessageByQuery({}, {
        limit: 10
    }, function(err, message) {
        proxy.emit('message', message);
    });

    Cls.getClsByQuery({}, function(err, cls) {
        proxy.emit('cls', cls);
    });

    Cls.getClsByQuery({
        content: clsName
    }, function(err, cls) {
        if (!cls.length) {
            req.flash('error', '类别不存在');
            res.redirect('/');
        }
        query.cls = cls[0]['_id'];

        Topic.getTopicsByQuery(query, options, function(err, docs) {
            proxy.emit('topic', docs);
        });

        Topic.getCountByQuery(query, function(err, count) {
            proxy.emit('count', count);
        });
    });
}
