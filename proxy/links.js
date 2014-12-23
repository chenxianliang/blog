var models = require('../models');
var Links = models.Links;
var EventProxy = require('eventproxy');
var getTime  = require('../tool/getTime');


/**
 * 获取一条类别
 * @param {String} id 类别ID
 * @param {Function} callback 回调函数
 */
exports.getLink = function(id, callback) {
    Links.findOne({
        _id: id
    }, callback);
}

exports.getMaxSort = function(callback) {
    var options = {
        skip: 0,
        limit: 1,
        sort: '-sort'
    };
    Links.findOne({}, '', options, function(err, link) {
        if (err) {
            return console.log('出错了');
        }
        if (!link) {
            return callback(null, 0);
        }
        callback(null, link.sort);
    })
}

exports.getLinksByQuery = function(query, opt, callback) {
    if(!opt){
        callback = opt;
        opt = {};
    }
    Links.find(query, '', opt, function(err, link) {
        if (err) {
            return callback(err);
        }
        if (link.length === 0) {
            return callback(null, []);
        }
        callback(null,link);
    })
}

/**
 * 创建并保存一条类别信息
 * @param {Function} callback 回调函数
 */
exports.newAndSave = function(url , name , is_lock , callback) {
    var links = new Links();
    links.url = url;
    links.name = name;
    links.is_lock = is_lock;
    links.create_at = getTime();
    links.update_at = getTime();
    exports.getMaxSort(function(err, sort) {
        links.sort = sort + 1;
        links.save(function(err) {
            callback(err, links);
        });
    });
};
