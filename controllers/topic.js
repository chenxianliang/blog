var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Reply = require('../proxy/reply');
var models = require('../models');
var getTime = require('../tool/getTime');
var TopicModel = models.Topic;
var ReplyModel = models.Reply;

var EventProxy = require('eventproxy');

exports.post = function(req, res) {
    res.render('admin/topic.html', {
        title: '文章发布',
        topic: null,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    })
}

exports.add = function(req, res) {
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
    Topic.newAndSave(oTopic, function(err, obj) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('/admin/topic_post');
        }
        req.flash('success', '发布成功!');
        res.redirect('/admin/topic_post'); //
    })
}


exports.blist = function(req, res) {
    Topic.getTopicsByQuery({}, '', function(err, docs) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('back');
        }
        res.render('admin/topicList.html', {
            title: '文章列表',
            topics: docs,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

exports.showEdit = function(req, res) {
    var id = req.params.id;
    Topic.getTopicById(id, function(err, topic) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('/admin/topic_post');
        }
        res.render('admin/topic.html', {
            title: '文章编辑',
            topic: topic,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })
}

exports.saveEdit = function(req, res) {
    var id = req.body.id;
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
            return; res.redirect('back');
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
