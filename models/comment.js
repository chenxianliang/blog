var mongodb = require('../tool/db');
var dbhelp = require('../tool/dbhelp');
var fixrow = require('../tool/fixrow');
var time = require('../tool/getTime');


function Comment(comment) {
    this.author = comment.author;
    this.ip = comment.ip;
    this.content = comment.content;
    this.post = comment.post;
}

module.exports = Comment;

Comment.prototype.add = function(callback) {
    var atime = time();
    var post = {
        atime: atime,
        author: this.author,
        ip: this.ip,
        content: this.content,
        out: false
    };
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('comment', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(post, {
                safe: true
            }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}


Comment.modify = function(id, rowInfo, callback) {
    dbhelp.modify(id, 'comment', rowInfo, callback);
}


Comment.getOne = function(id, callback) {
    dbhelp.getOne(id, 'comment', callback);
}

Comment.remove = function(id, callback) {
    dbhelp.remove(id, 'comment', callback);
}


Comment.list = function(query, callback) {
    dbhelp.list(query, 'comment', callback);
}
