var mongodb = require('../tool/db');
var dbhelp = require('../tool/dbhelp');
var fixrow = require('../tool/fixrow');
var rstring = require('../tool/rstring');
/**
 * [User 管理员模型] 包含字段：用户名，密码，邮件，随机密码，状态
 * @param {[type]} user [description]
 */
function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.truePassword = rstring(12);
    this.status = 1;
}
module.exports = User;

//存储用户信息
User.prototype.add = function(callback) {
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        truePassword:this.truePassword,
        status:this.status
    };
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err); //错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err); //错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, {
                safe: true
            }, function(err, user) {
                mongodb.close();
                if (err) {
                    return callback(err); //错误，返回 err 信息
                }
                callback(null, user[0]); //成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

User.modify = function(id, rowInfo, callback) {
    dbhelp.modify(id, 'users', rowInfo, callback);
}


User.getOne = function(id, callback) {
    dbhelp.getOne(id, 'users', callback);
}

User.remove = function(id, callback) {
    dbhelp.remove(id, 'users', callback);
}


User.list = function(query, callback) {
    dbhelp.list(query, 'users', callback);
}
