var models = require('../models');
var Reply = models.Reply;
var EventProxy = require('eventproxy');
var User = require('./user');


/**
 * 获取一条回复信息
 * @param {String} id 回复ID
 * @param {Function} callback 回调函数
 */
exports.getReply = function (id, callback) {
  Reply.findOne({_id: id}, callback);
};

/**
 * 根据回复ID，获取回复
 * Callback:
 * - err, 数据库异常
 * - reply, 回复内容
 * @param {String} id 回复ID
 * @param {Function} callback 回调函数
 */
exports.getReplyById = function (id, callback) {
  Reply.findOne({_id: id}, function (err, reply) {

    if (err) {
      return callback(err);
    }

    if (!reply) {
      return callback(err, null);
    }

    var author_id = reply.author_id;
    User.getUserById(author_id, function (err, author) {
      if (err) {
        return callback(err);
      }

      reply = JSON.parse(JSON.stringify(reply));

      reply.author = author;
      
      callback(null,reply);
    });
  });
};



/**
 * 根据主题ID，获取回复列表
 * Callback:
 * - err, 数据库异常
 * - replies, 回复列表
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getRepliesByTopicId = function (id, cb) {
  Reply.find({topic_id: id}, '', {sort: '-_id'}, function (err, replies) {
    if (err) {
      return cb(err);
    }
    if (replies.length === 0) {
      return cb(null, []);
    }

    var proxy = new EventProxy();
    proxy.after('reply_find', replies.length, function () {
      cb(null, replies);
    });
    for (var j = 0; j < replies.length; j++) {
      (function (i) {
        var author_id = replies[i].author_id;
        User.getUserById(author_id, function (err, author) {
          if (err) {
            return cb(err);
          }
          replies[i] = JSON.parse(JSON.stringify(replies[i]));
          replies[i].author = author || { _id: '' };
          proxy.emit('reply_find');
        });
      })(j);
    }
  });
};

/**
 * 根据查询条件，获取回复列表
 * Callback:
 * - err, 数据库异常
 * - replies, 回复列表
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getRepliesByQuery = function (query,opt, cb) {
  Reply.find(query, '', opt, function (err, replies) {
    if (err) {
      return cb(err);
    }
    if (replies.length === 0) {
      return cb(null, []);
    }

    var proxy = new EventProxy();
    proxy.after('reply_find', replies.length, function () {
      cb(null, replies);
    });
    for (var j = 0; j < replies.length; j++) {
      (function (i) {
        var author_id = replies[i].author_id;
        User.getUserById(author_id, function (err, author) {
          if (err) {
            return cb(err);
          }
          replies[i] = JSON.parse(JSON.stringify(replies[i]));
          replies[i].author = author || { _id: '' };
          proxy.emit('reply_find');
        });
      })(j);
    }
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
exports.newAndSave = function (content, topicId, authorId, ip, replyId,callback) {
  if (typeof replyId === 'function') {
    callback = replyId;
    replyId = null;
  }
  var reply = new Reply();
  reply.content = content.replace(/\</g,'&lt').replace(/\>/g,'&gt');
  reply.topic_id = topicId;
  reply.author_id = authorId;
  reply.ip = ip;
  if (replyId) {
    reply.reply_id = replyId;
  }
  reply.save(function (err) {
    callback(err, reply);
  });
};


exports.getRepliesByAuthorId = function (authorId, opt, callback) {
  if (!callback) {
    callback = opt;
    opt = null;
  }
  Reply.find({author_id: authorId}, {}, opt, callback);
};

// 通过 author_id 获取回复总数
exports.getCountByAuthorId = function (authorId, callback) {
  Reply.count({author_id: authorId}, callback);
};


// 通过 topicId 获取回复总数
exports.getCountByTopicId = function (topic_id, callback) {
  Reply.count({topic_id: topic_id}, callback);
};
