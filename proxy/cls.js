var models = require('../models');
var Cls = models.Cls;
var EventProxy = require('eventproxy');


/**
 * 获取一条类别
 * @param {String} id 类别ID
 * @param {Function} callback 回调函数
 */
exports.getCls = function(id, callback) {
    Cls.findOne({
        _id: id
    }, callback);
}

exports.getMaxSort = function(callback) {
    var options = {
        skip: 0,
        limit: 1,
        sort: '-sort'
    };
    Cls.findOne({}, '', options, function(err, c) {
        if (err) {
            return console.log('出错了');
        }
        if (!c) {
            return callback(null, 0);
        }
        callback(null, c.sort);
    })
}

exports.getClsByQuery = function(query, opt, callback) {
    if(!opt){
        callback = opt;
        opt = {};
    }
    Cls.find(query, '', opt, function(err, cls) {
        if (err) {
            return callback(err);
        }
        if (cls.length === 0) {
            return callback(null, []);
        }
        callback(null,cls);
    })
}

/**
 * 创建并保存一条类别信息
 * @param {Function} callback 回调函数
 */
exports.newAndSave = function(content,display_name,is_lock, callback) {
    var cls = new Cls();
    cls.content = content;
    cls.display_name = display_name;
    cls.is_lock = is_lock;
    exports.getMaxSort(function(err, sort) {
        cls.sort = sort + 1;
        cls.save(function(err) {
            callback(err, cls);
        });
    });
};
