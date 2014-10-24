var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Reply = require('../proxy/reply');
var models = require('../models');
var TopicModel = models.Topic;
var ReplyModel = models.Reply;
var crypto = require('../tool/crypto');

var EventProxy = require('eventproxy');


exports.showAdd = function(req, res) {
    res.render('admin/user.html', {
        title: '添加管理员',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.add = function(req, res) {
    var name = req.body.name,
        loginname = req.body.loginname,
        password = req.body.pass,
        password_re = req.body.pass2;
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/admin/addUser'); //返回注册页
    }
    if (!name || !password || !req.body.email) {
        req.flash('error', '数据不能为空!');
        return res.redirect('/admin/addUser'); //返回注册页
    }
    //生成密码的 md5 值
    var password = crypto.encode('hash', 'md5', req.body.pass, 'hex');

    //检查用户名是否已经存在
    User.getUserByLoginName(loginname, function(err, u) {
        if (err) {
            req.flash('error', '未知错误');
            return res.redirect('/admin/addUser'); //返回注册页
        }
        if (u) {
            req.flash('error', '用户已存在!');
            return res.redirect('/admin/addUser'); //返回注册页
        }
        User.newAndSave(name, loginname, password, req.body.email, function(err, user) {
            if (err) {
                req.flash('error', '未知错误');
                return res.redirect('/admin/addUser'); //返回注册页
            }
            user.id = user['_id'];
            req.session.user = user; //用户信息存入 session
            req.flash('success', '注册成功!');
            res.redirect('/admin/addUser'); //注册成功后返回主页
        })
    })
}

exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/admin_login');
}

exports.showLogin = function(req, res) {
    res.render('admin/login.html', {
        title: '用户登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.loginAction = function(req, res) {
    var name = req.body.loginname,
        password = req.body.pass;
    if (!name || !password) {
        req.flash('error', '信息不能为空!');
        return res.redirect('/admin_login');
    }
    User.getUserByLoginName(name, function(err, user) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('/admin_login');
        }
        if(!user){
            req.flash('error', '用户名不存在!');
            return res.redirect('/admin_login');
        }
        var pass = crypto.encode('hash','md5',password,'hex');
        if(pass != user.pass){
            req.flash('error', '密码错误!');
            return res.redirect('/admin_login');
        }
        user.id = user['_id'];
        req.session.user = user ;
        res.redirect('/admin');
    })
}
