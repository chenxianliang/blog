var mongodb = require('../tool/db');
var dbhelp = require('../tool/dbhelp');
var fixrow = require('../tool/fixrow');
var rstring = require('../tool/rstring');
var time = require('../tool/getTime');

function Post(post) {
    this.author = post.author;
    this.title = post.title;
    this.content = post.content;
    this.address = post.address;
    this.prePic = post.prePic;
    this.sign = post.sign;
    this.top = post.top;
    this.slide = post.slide;
    this.arrowComment = post.arrowComment;
    this.out = post.out;
    this.mtime = post.mtime || '';
    this.cls = post.cls;
    this.preview = post.preview;
}

module.exports = Post;
Post.prototype.add = function(callback) {
    var atime = time();
    var post = {
        atime: atime,
        author: this.author,
        title: this.title,
        content: this.content,
        address: this.address,
        prePic: this.prePic,
        sign: this.sign,
        top: this.top,
        slide: this.slide,
        arrowComment: this.arrowComment,
        out: this.out,
        mtime: this.mtime,
        cls: this.cls,
        preview: this.preview
    };
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('post', function(err, collection) {
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

Post.modify = function(id, rowInfo, callback) {
    dbhelp.modify(id, 'post', rowInfo, callback);
}


Post.getOne = function(id, callback) {
    dbhelp.getOne(id, 'post', callback);
}

Post.remove = function(id, callback) {
    dbhelp.remove(id, 'post', callback);
}


Post.list = function(query, callback) {
    dbhelp.list(query, 'post', callback);
}
