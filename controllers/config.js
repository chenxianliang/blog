var fs = require('fs');
var path = require('path');
var config_name = path.join('.','settings.js');

exports.show = function(req,res){
	var config = require('../settings');
	res.render('admin/config.html', {
        title: 'cZone管理平台',
        user: req.session.user,
        config:config,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.save = function(req,res){
	var data  = JSON.stringify(req.body);

	var config_str = 'module.exports='+ data +'';

	fs.writeFile(config_name,config_str,'utf8',function(err){
		if(err){
			req.flash('error','配置文件保存失败!')
			return res.redirect('back');
		}
		req.flash('success','配置文件保存成功!');
		res.redirect('back');
	})
}
