var crypto = require('../tool/crypto'),
    User = require('../models/user');

exports.loginShow = function(req, res) {
    res.render('admin/login.html', {
        title: '用户登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.loginAction = function(req, res) {
    var name = req.body.name,
        password = req.body.password;
    if (!name || !password) {
        req.flash('error', '信息不能为空!');
        res.redirect('/login');
    }
    var user = {
        name: name
    };
    User.list(user, function(err, obj) {
        var userData = obj[0];
        if (!obj) {
            req.flash('error', '用户名不存在!');
            return res.redirect('/login');
        }
        var password = crypto.encode('hash','md5',req.body.password,'hex');
        if (password != userData.password) {
            req.flash('error', '密码错误!');
            return res.redirect('/login');
        }
        req.session.user = userData;
        req.flash('success', '密码错误!');
        res.redirect('/admin');
    })
}

exports.logout = function(req,res){
    req.session.user = null;
    req.flash('success','注销成功!');
    res.redirect('/');
}
