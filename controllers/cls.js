var Cls = require('../proxy/cls');

exports.showAdd = function(req, res) {
    res.render('admin/cls.html', {
        title: '添加类别',
        cls:null,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.add = function(req, res) {

    var content = req.body.content;
    var display_name = req.body.display_name;
    var is_lock = req.body.is_lock  || false;
    Cls.newAndSave(content,display_name,is_lock, function(err, obj) {
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
        sort: 'sort'
    }

    Cls.getClsByQuery({}, options, function(err, cls) {
        if (err) {
            console.log(err);
            return res.redirect('back');
        }
        res.render('admin/clsList.html', {
            title: '添加类别',
            cls: cls,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

exports.showEdit = function(req,res){
    var id = req.params.id;
    Cls.getCls(id,function(err,cls){
        if(err){
            req.flash('error','类别已经不存在');
            return res.redirect('back');
        }
        res.render('admin/cls.html', {
            title: '添加类别',
            cls:cls,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}


exports.saveEdit = function(req,res){
    var id = req.body.id;
    var oCls = {
        content: req.body.content,
        display_name:req.body.display_name,
        is_lock:req.body.is_lock || false
    }
    if (!oCls.content) {
        req.flash('error', '有必要信息未填!');
        return res.redirect('back');
    }

    Cls.getCls(id, function(err,cls) {
        if (err) {
            req.flash('error', '未知错误!');
            return res.redirect('back');
        }
        if (!cls) {
            req.flash('error', '类别已经不存在!');
            return res.redirect('/admin/cls_list');
        }
        for (var attr in oCls) {
            cls[attr] = oCls[attr];
        }
        cls.save(function(err) {
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
    Cls.getCls(id, function(err, cls) {
        if (!cls) {
            req.flash('error', '类别已经不存在!');
            res.redirect('back');
        }
        cls.remove(function(err) {
            if (err) {
                req.flash('error', '删除失败!');
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            res.redirect('back');
        });
    });
}