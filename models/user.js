var mongodb = require('./db');
var fixrow = require('./fixrow');
var rstring = require('./rstring');
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
User.prototype.save = function(callback) {
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

User.save = function(id, query, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(false); //错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(false); //错误，返回 err 信息
            }
            var mongoid = new requrie('mongodb').ObjectID(id);
            collection.save({
                '_id': mongoid
            }, query, {
                safe: true
            }, function(err) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            })

        });
    });
}

//读取用户信息
User.get = function(query, callback) {
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
            //查找用户名（id键）值为 name 一个文档

            collection.findOne(query, function(err, user) {
                mongodb.close();
                if (err) {
                    return callback(err); //失败！返回 err 信息
                }
                callback(null, fixrow(user)); //成功！返回查询的用户信息
            });
        });
    });
};
