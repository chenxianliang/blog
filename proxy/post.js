var Post = require('../models/post');
var time = require('../tool/getTime');

exports.adminShow = function(req, res) {
    res.render('admin/post.html', {
        title: '文章发布',
        post:null,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    })
}
exports.add = function(req, res) {
    var title = req.body.title,
        cls = req.body.cls,
        prePic = req.body.prePic,
        address = req.body.address,
        sign = req.body.sign,
        content = req.body.content,
        top = req.body.top,
        slide = req.body.slide,
        arrowComment = req.body.arrowComment,
        out = req.body.out,
        preview = req.body.preview;
    if (!title || !cls || !content) {
        req.flash('error', '有必要信息未填!');
        return res.redirect('/admin/post');
    }

    var post = new Post({
        title: title,
        cls: cls,
        address: address,
        sign: sign,
        prePic: prePic,
        content: content,
        top: top,
        slide: slide,
        arrowComment: arrowComment,
        out: out,
        author: req.session.user.name,
        preview: preview
    });

    //
    post.add(function(err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/admin/post'); //
        }
        req.flash('success', '发布成功!');
        res.redirect('/admin/post'); //
    });
}

exports.edit = function(req, res) {
    var id = req.params.id;
    Post.getOne(id, function(err, obj) {
        res.render('admin/post.html', {
            title: '文章编辑',
            post:obj,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })
}

exports.blist = function(req,res){
	Post.list(null, function(err, docs) {
        res.render('admin/postList.html', {
            title: '文章列表',
            posts: docs,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

exports.save = function(req,res){
	var id = req.body.id;
	var date = new Date();
	var mtime = time();
	var post = { 
		title : req.body.title,
        cls : req.body.cls,
        prePic : req.body.prePic,
        address : req.body.address,
        sign : req.body.sign,
        content : req.body.content,
        top : req.body.top,
        slide : req.body.slide,
        arrowComment : req.body.arrowComment,
        out : req.body.out,
        preview : req.body.preview,
        mtime : mtime
     }
    if (!req.body.title || !req.body.cls || !req.body.content) {
        req.flash('error', '有必要信息未填!');
        return res.redirect('back');
    }
    Post.modify(id,post,function(err){
    	if(err){
    		req.flash('error','更新失败');
    		return res.redirect('back');
    	}else{
    		req.flash('success','更新成功');
    		return res.redirect('back');
    	}
    })
}

exports.remove = function(req,res){
	Post.remove(req.params.id,function(err){
		if(err){
			req.flash('error','删除失败');
			return res.redirect('back');
		}else{
            req.flash('success','删除成功');
    		return res.redirect('back');
		}
	})
}

exports.showList = function(req, res) {
    Post.list(null, function(err, obj) {
        res.render('index.html', {
            title: '首页',
            posts: obj,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

exports.showItem = function(req, res) {
    Post.getOne(req.params.id, function(err, obj) {
        res.render('detail.html', {
            title: obj.title,
            post: obj,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}
