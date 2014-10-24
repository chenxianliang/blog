var user = require('./controllers/user'),
    topic = require('./controllers/topic'),
    index = require('./controllers/index'),
    reply = require('./controllers/reply'),
    upload = require('./controllers/upload');

module.exports = function(app) {

    app.get('/admin',index.showAdmin);

    app.get('/admin/addUser', user.showAdd);

    app.post('/admin/addUser',user.add);

    app.get('/logout',user.logout);

    app.get('/admin_login',user.showLogin);

    app.post('/admin_login',user.loginAction);

    app.get('/admin/topic_post',topic.post);

    app.post('/admin/topic_post',topic.add);

    app.post('/upload-img',upload.img);

    app.get('/admin/topic_list',topic.blist);

    app.get('/admin/topic_edit/:id',topic.showEdit);

    app.post('/admin/topic_edit',topic.saveEdit);

    app.get('/admin/topic_remove/:id',topic.remove);

    app.get('/',index.showIndex);

    app.get('/topic/:id',topic.showItem);

    //处理ajax提交的回复
    
    app.post('/ajax/reply_add',reply.ajaxAdd);


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
