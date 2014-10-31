var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Reply = require('../proxy/reply');
var Cls = require('../proxy/cls');
var Message = require('../proxy/message');
var Links = require('../proxy/links');

var EventProxy = require('eventproxy');

var sys = require('../settings');

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
        sort: '-top -_id'
    };

    var query = {out:true};

    if (keyword) {
        query['title'] = new RegExp(keyword); //模糊查询参数
    }

    if (queryDate) {
        query['create_at.month'] = queryDate;
    }

    var proxy = new EventProxy();
    proxy.all('cls', 'topic', 'count', 'group', 'message', 'link', function(cls, topic, count, group, message, link) {
        res.render('index.html', {
            title: '首页',
            topics: topic,
            cls: cls,
            message: message,
            keyword: keyword,
            group: group,
            link: link,
            sys:sys,
            isHome: true,
            isDetail:false,
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
        limit: require('../settings').message_page_count
    }, function(err, message) {
        proxy.emit('message', message);
    });

    Topic.getTopicsByQuery({out:true}, {}, function(err, docs) {
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

    Links.getLinksByQuery({is_lock:true}, {
        sort: 'sort'
    }, function(err, link) {
        proxy.emit('link', link);
    });

    Topic.getTopicsByQuery(query, options, function(err, docs) {
        proxy.emit('topic', docs);
    });

    Topic.getCountByQuery(query, function(err, count) {
        proxy.emit('count', count);
    });

    Cls.getClsByQuery({is_lock:true}, function(err, cls) {
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
        sort: '-top -_id'
    };

    var query = {out:true};

    if (keyword) {
        query['title'] = new RegExp(keyword); //模糊查询参数
    }


    var proxy = new EventProxy();
    proxy.all('cls', 'topic', 'count', 'group', 'message', 'link', function(cls, topic, count, group, message, link) {
        res.render('index.html', {
            title: '首页',
            topics: topic,
            page: page,
            cls: cls,
            message: message,
            keyword: keyword,
            group: group,
            link: link,
            sys:sys,
            isDetail:false,
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

    Links.getLinksByQuery({is_lock:true}, {
        sort: 'sort'
    }, function(err, link) {
        proxy.emit('link', link);
    });


    Topic.getTopicsByQuery({out:true}, {}, function(err, docs) {
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
        limit: require('../settings').message_page_count
    }, function(err, message) {
        proxy.emit('message', message);
    });

    Cls.getClsByQuery({is_lock:true}, function(err, cls) {
        proxy.emit('cls', cls);
    });

    Cls.getClsByQuery({
        content: clsName
    }, function(err, cls) {
        if (!cls.length || !cls[0].is_lock) {
            req.flash('error', '类别不存在');
            return res.redirect('/');
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
