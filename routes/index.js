var user = require('../proxy/user'),
    login = require('../proxy/login'),
    index = require('../proxy/index'),
    post = require('../proxy/post');

module.exports = function(app) {

    app.get('/admin', checkLogin);
    app.get('/admin', index.adminShow);

    app.get('/admin/user', checkLogin);
    app.get('/admin/user', user.userShow);

    app.post('/admin/addUser', checkLogin);
    app.post('/admin/addUser', user.userAdd);

    app.get('/login', checkNotLogin);
    app.get('/login', login.loginShow);

    app.post('/login', checkNotLogin);
    app.post('/login', login.loginAction);

    app.get('/logout', checkLogin);
    app.get('/logout',login.logout);

    app.get('/admin/post',post.adminShow);

    app.post('/admin/postAdd',post.add);


    app.get('/',post.showList);
    app.get('/topic/:id',post.showItem);




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
