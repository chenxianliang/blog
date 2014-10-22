var  Post = require('../models/post');

exports.adminShow = function(req,res){
	var posts = new Post({});
	res.render('admin/post.html',{
		title: '文章发布',
		post:posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
	})
}
exports.add = function(req,res){
	var title = req.body.title,
		cls = req.body.cls,
		address = req.body.address,
		sign = req.body.sign,
		content = req.body.content,
		top = req.body.top,
		slide = req.body.slide,
		arrowComment = req.body.arrowComment,
		out = req.body.out,
		preview = req.body.preview;
		if(!title || !cls || !content){
			req.flash('error','有必要信息未填!');
			return res.redirect('/admin/post');
		}

		var post = new Post({
			title : title,
			cls : cls,
			address : address,
			sign : sign,
			content : content,
			top : top,
			slide : slide,
			arrowComment : arrowComment,
			out : out,
			author : req.session.user.name,
			preview:preview			
		});

		 //
        post.save(function(err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/admin/post'); //
            }
            req.flash('success', '发布成功!');
            res.redirect('/admin/post'); //
        });
}


exports.showList = function(req,res){
	 Post.get(null,function(err,obj){
	 	res.render('index.html', {
	        title: '首页',
	        posts:obj,
	        user: req.session.user,
	        success: req.flash('success').toString(),
	        error: req.flash('error').toString()
	    });
	 })
}

exports.showItem = function(req,res){
	Post.get(req.params.id,function(err,obj){
		res.render('detail.html', {
	        title: obj[0].title,
	        post:obj[0],
	        user: req.session.user,
	        success: req.flash('success').toString(),
	        error: req.flash('error').toString()
	    });
	})
}