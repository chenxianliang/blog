var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Reply = require('../proxy/reply');
var Message = require('../proxy/message');
var Cls = require('../proxy/cls');
var Links = require('../proxy/links');

var models = require('../models');
var getTime = require('../tool/getTime');
var TopicModel = models.Topic;
var ReplyModel = models.Reply;
var iphelp = require('../tool/ip');
var fs = require('fs');
var path = require('path');
var sys = require('../settings');


var EventProxy = require('eventproxy');

exports.post = function(req, res) {
    Cls.getClsByQuery({}, {
        sort: 'sort'
    }, function(err, cls) {
        if (err) {
            console.log('程序错误!');
            return res.redirect('back');
        }
        res.render('admin/topic.html', {
            title: '文章发布',
            topic: null,
            cls: cls,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });
}

exports.add = function(req, res) {
    if(!req.session.user['_id']){
        req.flash('error', '请重新登录!');
        return res.redirect('/');
    }
    var oTopic = {
        title: req.body.title,
        content: req.body.content,
        author_id: req.session.user['_id'],
        top: req.body.top, // 置顶帖
        slide: req.body.slide, // 幻灯
        address: req.body.address,
        thumb_pic: req.body.thumb_pic,
        arrow_reply: req.body.arrow_reply,
        cls: req.body.cls,
        out: req.body.out,
        preview: req.body.preview
    }

    if (!oTopic.title || !oTopic.cls || !oTopic.content) {
        req.flash('error', '有必要信息未填!');
        return res.redirect('/admin/topic_post');
    }

    Topic.getTopicsByQuery({
        address: req.body.address || '_______________________'
    }, '', function(err, docs) {
        if (docs.length) {
            req.flash('error', '该优化地址文章已经存在!');
            return res.redirect('/admin/topic_post');
        }

        Topic.newAndSave(oTopic, function(err, obj) {
            if (err) {
                req.flash('error', '未知错误!');
                return res.redirect('/admin/topic_post');
            }
            req.flash('success', '发布成功!');
            res.redirect('/admin/topic_post'); //
        })
    })
}


exports.blist = function(req, res) {

    var once = require('../settings').adminPage;
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var keyword = req.query.keyword ? req.query.keyword : '';

    var options = {
        skip: (page - 1) * once,
        limit: once,
        sort: '-_id'
    };

    var query = {};

    if (keyword) {
        query['title'] = new RegExp(keyword); //模糊查询参数
    }

    var proxy = new EventProxy();

    proxy.all('topic', 'count', function(topic, count) {
        res.render('admin/topicList.html', {
            title: '文章列表',
            topics: topic,
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: Math.ceil(count / once) == page,
            pageCount: Math.ceil(count / once),
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    Topic.getCountByQuery(query, function(err, count) {
        proxy.emit('count', count);
    });

    Topic.getTopicsByQuery(query, options, function(err, docs) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('back');
        }
        proxy.emit('topic', docs);
    });
}

exports.showEdit = function(req, res) {
    var id = req.params.id;
    Topic.getTopicById(id, function(err, topic) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('/admin/topic_post');
        }
        Cls.getClsByQuery({}, {
            sort: 'sort'
        }, function(err, cls) {
            if (err) {
                console.log('程序错误!');
                return res.redirect('back');
            }
            res.render('admin/topic.html', {
                title: '文章编辑',
                topic: topic,
                cls: cls,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    })
}

exports.saveEdit = function(req, res) {
    var id = req.body.id;
    var oTopic = {
        title: req.body.title,
        content: req.body.content,
        author_id: req.session.user['_id'],
        top: req.body.top || false, // 置顶帖
        slide: req.body.slide || false, // 幻灯
        address: req.body.address,
        thumb_pic: req.body.thumb_pic,
        arrow_reply: req.body.arrow_reply || false,
        cls: req.body.cls,
        out: req.body.out || false,
        update_at: getTime(),
        preview: req.body.preview
    }
    if (!oTopic.title || !oTopic.cls || !oTopic.content) {
        req.flash('error', '有必要信息未填!');
        return res.redirect('back');
    }

    Topic.getTopicById(id, function(err, topic, author, reply) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('back');
        }
        if (!topic) {
            req.flash('error', '文章已经不存在!');
            return res.redirect('/admin/topic_list');
        }
        if (author.id != req.session.user['_id']) {
            req.flash('error', '您无权编辑此文章!');
            return res.redirect('back');
        }
        for (var attr in oTopic) {
            topic[attr] = oTopic[attr];
        }
        topic.save(function(err) {
            if (err) {
                req.flash('error', '更新失败!');
            }

            req.flash('success', '更新成功!');
            res.redirect('back');
        });
    })

}

exports.remove = function(req, res) {
    var id = req.params.id;
    Topic.getTopicById(id, function(err, topic, author) {
        if (!topic) {
            req.flash('error', '文章已经不存在!');
            res.redirect('back');
        }
        if (author.id != req.session.user['_id']) {
            req.flash('error', '您无权编辑此文章!');
            return res.redirect('back');
        }
        topic.remove(function(err) {
            if (err) {
                req.flash('error', '删除失败!');
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            res.redirect('back');
        });
    });
}


exports.showItem = function(req, res) {
    var id = req.params.id;
    var once = require('../settings').reply_page_count;

    var options = {
        skip: 0,
        limit: once,
        sort: '-_id'
    };

    var proxy = new EventProxy();

    proxy.all('topic', 'author', 'reply', 'count', 'cls', 'group', 'message', 'link','add_visit', function(topic, author, reply, count, cls, group, message, link,add_visit) {
        res.render('detail.html', {
            title: topic.title,
            topic: topic,
            reply: reply,
            author: author,
            message: message,
            link: link,
            sys: sys,
            isDetail:true,
            next_reply: count > once,
            ip: iphelp.getip(req),
            group: group,
            keyword: '',
            isHome: false,
            tab: null,
            cls: cls,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
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

    Topic.addVisit(id,function(){
        proxy.emit('add_visit', null);
    });

    Message.getMessageByQuery({}, {
        limit: require('../settings').message_page_count
    }, function(err, message) {
        proxy.emit('message', message);
    });

    Links.getLinksByQuery({
        is_lock: true
    }, {
        sort: 'sort'
    }, function(err, link) {
        proxy.emit('link', link);
    });

    Topic.getTopicById(id, function(err, topic, author, reply) {
        if (!topic) {
            req.flash('error', '文章已经不存在!');
            return res.redirect('back');
        }
        if(!topic.out){
            return res.redirect('/');
        }
        proxy.emit('topic', topic);
        proxy.emit('author', author);
    });


    Reply.getRepliesByQuery({
        'topic_id': id
    }, options, function(err, rep) {
        rep.forEach(function(r) {
            if (isIp(r.ip)) {
                r.outIp = iphelp.fixip(r.ip);
            } else {
                r.outIp = r.ip;
            }
        });
        proxy.emit('reply', rep);
    });

    Reply.getCountByTopicId(id, function(err, count) {
        proxy.emit('count', count);
    });

    Cls.getClsByQuery({is_lock:true}, function(err, cls) {
        proxy.emit('cls', cls);
    });
}

exports.showItem_address = function(req, res) {
    var address = req.params.address;
    var once = require('../settings').reply_page_count;

    var options = {
        skip: 0,
        limit: once,
        sort: '-_id'
    };


    var proxy = new EventProxy();

    proxy.all('topic', 'author', 'reply', 'count', 'cls', 'group', 'message', 'link','add_visit', function(topic, author, reply, count, cls, group, message, link,add_visit) {
        res.render('detail.html', {
            title: topic.title,
            topic: topic,
            author: author,
            reply: reply,
            message: message,
            link: link,
            sys: sys,
            isDetail:true,
            next_reply: count > once,
            ip: iphelp.getip(req),
            group: group,
            keyword: '',
            isHome: false,
            tab: null,
            cls: cls,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    Links.getLinksByQuery({}, {
        sort: '-sort'
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

    Topic.getTopicByAddress(address, function(err, topic, author, reply) {
        if (!topic) {
            req.flash('error', '文章已经不存在!');
            return res.redirect('back');
        }
        proxy.emit('topic', topic);
        proxy.emit('author', author);

        if(!topic.out){
            req.redirect('/');
        }

        if(req.session.user){
            proxy.emit('add_visit', null);
        }else{
            Topic.addVisit(topic['_id'],function(){
                proxy.emit('add_visit', null);
            });
        }
        Reply.getRepliesByQuery({
            'topic_id': topic['_id']
        }, options, function(err, rep) {
            rep.forEach(function(r) {
                if (isIp(r.ip)) {
                    r.outIp = iphelp.fixip(r.ip);
                } else {
                    r.outIp = r.ip;
                }
            });
            proxy.emit('reply', rep);
        });

        Reply.getCountByTopicId(topic['_id'], function(err, count) {
            proxy.emit('count', count);
        });

    });

    Cls.getClsByQuery({is_lock:true}, function(err, cls) {
        proxy.emit('cls', cls);
    });
}

function isIp(ip) {
    var reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    return ip.match(reg);
}
