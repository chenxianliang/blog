var user = require('./controllers/user'),
    topic = require('./controllers/topic'),
    index = require('./controllers/index'),
    reply = require('./controllers/reply'),
    upload = require('./controllers/upload'),
    config = require('./controllers/config'),
    message = require('./controllers/message'),
    cls = require('./controllers/cls');

module.exports = function(app) {

    //网站首页
    app.get('/', index.showIndex);

    //列表
    app.get('/tab/:clsName',index.showIndex_tab);
    app.get('/date/:date',index.showIndex);

    //文章内容
    app.get('/topic/:id', topic.showItem);
    app.get('/html/:address',topic.showItem_address);

    //后台首页
    app.get('/admin', index.showAdmin);

    //用户
    app.get('/admin/addUser', user.showAdd);
    app.post('/admin/addUser', user.add);


    //登录登出
    app.get('/logout', user.logout);
    app.get('/admin_login', user.showLogin);
    app.post('/admin_login', user.loginAction);

    //文章
    app.get('/admin/topic_post', topic.post);
    app.post('/admin/topic_post', topic.add);
    app.get('/admin/topic_list', topic.blist);
    app.get('/admin/topic_edit/:id', topic.showEdit);
    app.post('/admin/topic_edit', topic.saveEdit);
    app.get('/admin/topic_remove/:id', topic.remove);

    //上传
    app.post('/upload-img', upload.img);

    //类别
    app.get('/admim/addCls', cls.showAdd);
    app.post('/admin/addCls',cls.add);
    app.get('/admin/cls_list',cls.list);
    app.get('/admin/cls_edit/:id',cls.showEdit);
    app.post('/admin/cls_edit',cls.saveEdit);


    //系统配置
    app.get('/admin/config',config.show);
    app.post('/admin/config_save',config.save)

    //留言
    app.get('/admin/message_list',message.blist);





    

    





    //处理ajax提交的回复
    app.post('/ajax/reply_add', reply.ajaxAdd);
    app.get('/ajax/more_reply', reply.ajaxload);
    app.post('/ajax/message_add',message.ajaxAdd);


    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            return res.redirect('/admin');
        }
        next();
    }
}
