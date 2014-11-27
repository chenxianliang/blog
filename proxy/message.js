var models = require('../models');
var Message = models.Message;
var EventProxy = require('eventproxy');
var getTime  = require('../tool/getTime');


/**
 * 获取一条回复信息
 * @param {String} id 回复ID
 * @param {Function} callback 回调函数
 */
exports.getMessage = function (id, callback) {
  Message.findOne({_id: id}, callback);
};

/**
 * 根据查询条件，获取回复列表
 * Callback:
 * - err, 数据库异常
 * - replies, 回复列表
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getMessageByQuery = function (query,opt, cb) {
  Message.find(query, '', opt, function (err, msgs) {
    if (err) {
      return cb(err);
    }
    if (msgs.length === 0) {
      return cb(null, []);
    }
    cb(null,msgs);
  });
};


/**
 * 创建并保存一条回复信息
 * @param {String} content 回复内容
 * @param {String} topicId 主题ID
 * @param {String} authorId 回复作者
 * @param {String} [replyId] 回复ID，当二级回复时设定该值
 * @param {Function} callback 回调函数
 */
exports.newAndSave = function (content, ip, author ,callback) {
  
  var msg = new Message();
  msg.content = content.replace(/\</g,'&lt').replace(/\>/g,'&gt');
  msg.ip = ip;
  msg.author = author;
  msg.create_at = getTime();
  msg.update_at = getTime();
  
  msg.save(function (err) {
    callback(err, msg);
  });
};
