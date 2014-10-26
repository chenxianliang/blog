var Links = require('../proxy/links');

exports.showAdd = function(req, res) {
    res.render('admin/link.html', {
        title: '添加链接',
        link: null,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.add = function(req, res) {
    var url = req.body.url;
    var name = req.body.name;
    var is_lock = req.body.is_lock;
    if (url == '' || name == '') {
        req.flash('error', '信息不能为空!');
        return res.redirect('back');
    }
    Links.newAndSave(url, name, is_lock, function(err, obj) {
        if (err) {
            req.flash('error', '保存失败!');
            return res.redirect('back');
        }
        req.flash('success', '保存成功!');
        res.redirect('back');
    })
}

exports.list = function(req, res) {
    var options = {
        sort: '-is_lock'
    }

    Links.getLinksByQuery({}, options, function(err, link) {
        if (err) {
            console.log(err);
            return res.redirect('back');
        }
        res.render('admin/linkList.html', {
            title: '友链列表',
            link: link,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}

exports.showEdit = function(req, res) {
    var id = req.params.id;
    Links.getLink(id, function(err, link) {
        if (err) {
            req.flash('error', '类别已经不存在');
            return res.redirect('back');
        }
        res.render('admin/link.html', {
            title: '修改友链',
            link: link,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    })
}

exports.saveEdit = function(req, res) {
    var id = req.body.id;
    var oLinks = {
        url: req.body.url,
        name: req.body.name,
        is_lock: req.body.is_lock
    }
    if (!oLinks.url || !oLinks.name) {
        req.flash('error', '有必要信息未填!');
        return res.redirect('back');
    }
    Links.getLink(id, function(err, link) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('back');
        }
        if (!link) {
            req.flash('error', '类别已经不存在!');
            return res.redirect('/admin/cls_list');
        }
        for (var attr in oLinks) {
            link[attr] = oLinks[attr];
        }
        link.save(function(err) {
            if (err) {
                req.flash('error', '更新失败!');
            }
            req.flash('success', '更新成功!');
            res.redirect('back');
        });
    })
}
