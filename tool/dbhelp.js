var mongodb = require('./db');
var fixrow = require('./fixrow');

/**
 * 查找一条数据
 * @param  {[type]}   id       [id]
 * @param  {[type]}   table    [文档名]
 * @param  {Function} callback [回调函数：包含两个参数：错误信息,查询结果]
 * @return {[type]}            [description]
 */
exports.getOne = function(id, table, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(table, function(err, collection) {
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
                callback(null, outArray[0]);
            })
        })
    })
}

/**
 * 查询列表
 * @param  {[type]}   id       [description]
 * @param  {[type]}   table    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.list = function(query, table, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(table, function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
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


exports.modify = function(id, table, rowInfo, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(table, function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            var mongoid = new require('mongodb').ObjectID(id);

            collection.update({
                '_id': mongoid
            }, {
                $set: rowInfo
            }, {
                safe: true
            }, function(err) {
                mongodb.close();
                if (err) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        })
    })
}



exports.remove = function(id, table, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(table, function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                var mongoid = new require('mongodb').ObjectID(id);
                query['_id'] = mongoid;
            }
            collection.remove(query, {
                w: 1
            }, function(err) {
                mongodb.close();
                if (err) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        })
    })
}
