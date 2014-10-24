var user = require('./controllers/user'),
    topic = require('./controllers/topic'),
    index = require('./controllers/index'),
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

    
    // app.get('/admin/postEdit/:id',post.edit);

    // app.get('/admin/postRemove/:id',post.remove);

    // app.post('/admin/postEdit',post.save);

    // app.get('/admin/postList',post.blist);


    // app.post('/admin/postAdd',post.add);



    // app.get('/',post.showList);
    // app.get('/topic/:id',post.showItem);


    // app.post('/upload-img',upload.img);



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
