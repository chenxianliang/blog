var mongodb = require('./db');
var fixrow = require('./fixrow');

function Post(post) {
    this.author = post.author;
    this.title = post.title;
    this.content = post.content;
    this.address = post.address;
    this.pic = post.pic;
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
Post.prototype.save = function(callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var atime = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    var post = {
        atime: atime,
        author: this.author,
        title: this.title,
        content: this.content,
        address : this.address,
        pic : this.pic,
        sign : this.sign,
        top  : this.top,
        slide : this.slide,
        arrowComment : this.arrowComment,
        out : this.out,
        mtime : this.mtime,
        cls : this.cls,
        preview:this.preview
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

Post.get = function(id, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('post', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                var mongoid = new require('mongodb').ObjectID(id);
                query['_id'] = mongoid;
            }


            collection.find(query).toArray(function(err, docs) {
                var outArray = [];
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                for (var i = 0; i < docs.length; i++) {
                    outArray.push(fixrow(docs[i]))
                }
                callback(null, outArray);
            })
        })
    })
}

