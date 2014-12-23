var EventProxy = require('eventproxy');
var models = require('../models');
var Topic = models.Topic;
var User = require('./user');
var Reply = require('./reply');
var Cls = require('./cls');
var getTime  = require('../tool/getTime');

/**
 * 根据主题ID获取主题
 * Callback:
 * - err, 数据库错误
 * - topic, 主题
 * - author, 作者
 * - lastReply, 最后回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getTopicById = function (id, callback) {
  var proxy = new EventProxy();
  var events = ['topic', 'author', 'last_reply','cls'];
  proxy.assign(events, function (topic, author, last_reply,cls) {
    if (!author) {
      return callback(null, null, null, null,null);
    }
    return callback(null, topic, author, last_reply,cls);
  }).fail(callback);

  Topic.findOne({_id: id}, proxy.done(function (topic) {
    if (!topic) {
      proxy.emit('topic', null);
      proxy.emit('author', null);
      proxy.emit('last_reply', null);
      proxy.emit('cls', null);
      return;
    }    
    proxy.emit('topic', topic);

    User.getUserById(topic.author_id, proxy.done('author'));

    if (topic.last_reply) {
      Reply.getReplyById(topic.last_reply, proxy.done(function (last_reply) {
        proxy.emit('last_reply', last_reply);
      }));
    } else {
      proxy.emit('last_reply', null);
    }
    Cls.getCls(topic.cls,proxy.done('cls'));
  }));
};


/**
 * 根据优化地址获取主题
 * Callback:
 * - err, 数据库错误
 * - topic, 主题
 * - author, 作者
 * - lastReply, 最后回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getTopicByAddress = function (address, callback) {
  var proxy = new EventProxy();
  var events = ['topic', 'author', 'last_reply','cls'];
  proxy.assign(events, function (topic, author, last_reply,cls) {
    if (!author) {
      return callback(null, null, null, null,null);
    }
    return callback(null, topic, author, last_reply,cls);
  }).fail(callback);

  Topic.findOne({address: address}, proxy.done(function (topic) {
    if (!topic) {
      proxy.emit('topic', null);
      proxy.emit('author', null);
      proxy.emit('last_reply', null);
      proxy.emit('cls', null);
      return;
    }    
    proxy.emit('topic', topic);

    User.getUserById(topic.author_id, proxy.done('author'));

    if (topic.last_reply) {
      Reply.getReplyById(topic.last_reply, proxy.done(function (last_reply) {
        proxy.emit('last_reply', last_reply);
      }));
    } else {
      proxy.emit('last_reply', null);
    }
    Cls.getCls(topic.cls,proxy.done('cls'));
  }));
};

/**
 * 获取关键词能搜索到的主题数量
 * Callback:
 * - err, 数据库错误
 * - count, 主题数量
 * @param {String} query 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getCountByQuery = function (query, callback) {
  Topic.count(query, callback);
};



/**
 * 根据关键词，获取主题列表
 * Callback:
 * - err, 数据库错误
 * - count, 主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getTopicsByQuery = function (query, opt, callback) {
  Topic.find(query, '_id', opt, function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback(null, []);
    }

    var topics_id = [];
    for (var i = 0; i < docs.length; i++) {
      topics_id.push(docs[i]._id);
    }


    var proxy = new EventProxy();
    proxy.after('topic_ready', topics_id.length, function (topics) {
      // 过滤掉空值
      var filtered = topics.filter(function (item) {
        return !!item;
      });
      return callback(null, filtered);
    });
    proxy.fail(callback);

    topics_id.forEach(function (id, i) {
      exports.getTopicById(id, proxy.group('topic_ready', function (topic, author, last_reply,cls) {
        // 当id查询出来之后，进一步查询列表时，文章可能已经被删除了
        // 所以这里有可能是null
        if (topic) {
         // topic = JSON.parse(JSON.stringify( topic ));
         // 
          //topic = JSON.parse(JSON.stringify(topic));
          topic.author = author;
          topic.reply = last_reply;
          topic.oCls = cls;
        }
        return topic;
      }));
    });
  });
};

// for sitemap
exports.getLimit5w = function (callback) {
  Topic.find({}, '_id', {limit: 50000, sort: '-create_at'}, callback);
};


/**
 * 更新主题的最后回复信息
 * @param {String} topicId 主题ID
 * @param {String} replyId 回复ID
 * @param {Function} callback 回调函数
 */
exports.updateLastReply = function (topicId, replyId, callback) {
  Topic.findOne({_id: topicId}, function (err, topic) {
    if (err || !topic) {
      return callback(err);
    }
    topic.last_reply = replyId;
    topic.last_reply_at = new Date();
    topic.reply_count += 1;
    topic.save(callback);
  });
};

/**
 * 根据主题ID，查找一条主题
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getTopic = function (id, callback) {
  Topic.findOne({_id: id}, callback);
};

/**
 * 将当前主题的访问量计数减1
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.addVisit = function (id, callback) {
  Topic.findOne({_id: id}, function (err, topic) {
    if (err) {
      return callback(err);
    }

    if (!topic) {
      return callback(new Error('该主题不存在'));
    }

    topic.visit_count += 1;
    topic.save(callback);
  });
};

/**
 * 将当前主题的回复计数减1，删除回复时用到
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.reduceCount = function (id, callback) {
  Topic.findOne({_id: id}, function (err, topic) {
    if (err) {
      return callback(err);
    }

    if (!topic) {
      return callback(new Error('该主题不存在'));
    }

    topic.reply_count -= 1;
    topic.save(callback);
  });
};

exports.newAndSave = function (obj,callback) {
  var topic = new Topic();
  topic.title = obj.title;
  topic.content = obj.content;
  topic.address = obj.address;
  topic.author_id = obj.author_id;
  topic.thumb_pic = obj.thumb_pic;
  topic.cls = obj.cls;
  topic.top = obj.top;
  topic.slide = obj.slide;
  topic.arrow_replay = obj.arrow_replay;
  topic.out = obj.out;
  topic.preview = obj.preview;
  topic.keyword = obj.keyword;
  topic.description = obj.description;
  topic.create_at = getTime();
  topic.update_at = getTime();
  topic.save(callback);
};