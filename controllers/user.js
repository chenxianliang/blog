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
        users:null,
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
            req.flash('success', '注册成功!');
            res.redirect('/admin/addUser'); //注册成功后返回主页
        })
    })
}

exports.showEdit = function(req, res) {
    var id = req.session.user['_id'];
    User.getUserById(id,function(err,u){
        if(err){
            req.flash('error','用户不存在');
            return res.redirect('back');
        }
        res.render('admin/user.html', {
            title: '修改用户',
            users:u,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

exports.saveEdit = function(req,res){
    var id = req.session.user['_id'];
    var loginname = req.body.loginname;
    var name = req.body.name;
    var pass = req.body.pass;
    var pass2 = req.body.pass2;
    var email = req.body.email;
    var oldPass = req.body.oldPass;

    var oldPassMd5 = crypto.encode('hash', 'md5', oldPass, 'hex');
    var passMd5 = crypto.encode('hash', 'md5', pass, 'hex');

    if(pass != pass2){
        req.flash('error', '有必要信息未填!');
        return res.redirect('back');
    }

    if (loginname =='' || name == '' || pass == '') {
        req.flash('error', '有必要信息未填!');
        return res.redirect('back');
    }

    User.getUserById(id, function(err,u) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('back');
        }
        if (!u) {
            req.flash('error', '用户已经不存在!');
            return res.redirect('/admin');
        }
        if(oldPassMd5 != u.pass){
            req.flash('error', '原密码错误!');
            return res.redirect('/admin');
        }
        u.loginname = loginname;
        u.name = name;
        u.pass = passMd5;
        u.email = email;
        
        u.save(function(err) {
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
    User.getUserById(id, function(err, user) {
        if (!user) {
            req.flash('error', '用户已经不存在!');
            res.redirect('back');
        }
        user.remove(function(err) {
            if (err) {
                req.flash('error', '删除失败!');
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            res.redirect('back');
        });
    });
}

exports.list = function(req, res) {
    var options = {}

    User.getUsersByQuery({}, options, function(err, users) {
        if (err) {
            console.log(err);
            return res.redirect('back');
        }
        res.render('admin/userList.html', {
            title: '添加类别',
            users: users,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
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
        if (!user) {
            req.flash('error', '用户名不存在!');
            return res.redirect('/admin_login');
        }
        var pass = crypto.encode('hash', 'md5', password, 'hex');
        if (pass != user.pass) {
            req.flash('error', '密码错误!');
            return res.redirect('/admin_login');
        }
        user.id = user['_id'];
        req.session.user = user;
        res.redirect('/admin');
    })
}
