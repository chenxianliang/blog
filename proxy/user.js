var crypto = require('../tool/crypto'),
    User = require('../models/user');


exports.index = function(req, res) {
    res.render('admin/index.html', {
        title: 'cZone管理平台',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};

exports.userShow = function(req, res) {
    res.render('admin/user.html', {
        title: '管理员维护',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.userAdd = function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body.password2;
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/admin/user'); //返回注册页
    }
    if (!name || !password || !req.body.email) {
        req.flash('error', '数据不能为空!');
        return res.redirect('/admin/user'); //返回注册页
    }
    //生成密码的 md5 值
    var password = crypto.encode('hash','md5',req.body.password,'hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在 

    var query = {};
    query.name = newUser.name;
    User.list(query, function(err, user) {
        if (user) {
            req.flash('error', '用户已存在!');
            return res.redirect('/admin/user'); //返回注册页
        }
        //如果不存在则新增用户
        newUser.add(function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/admin/user'); //注册失败返回主册页
            }
            req.session.user = user; //用户信息存入 session
            req.flash('success', '注册成功!');
            res.redirect('/admin/user'); //注册成功后返回主页
        });
    });
}

exports.loginShow = function(req, res) {
    res.render('admin/login.html', {
        title: '用户登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}


