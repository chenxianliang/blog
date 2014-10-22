var crypto = require('crypto'),
    User = require('../models/user'),
    Post = require('../models/post');

exports.adminShow = function(req, res) {
    res.render('admin/index.html', {
        title: 'cZone管理平台',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};
