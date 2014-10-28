var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Reply = require('../proxy/reply');
var models = require('../models');
var getTime = require('../tool/getTime');
var TopicModel = models.Topic;
var ReplyModel = models.Reply;


/**
 * [ajaxAdd 处理客户端ajax提交的评论]
 * 提交的表单参数：
 * 	1、content
 * 	2、reply_id
 * 	3、ip
 * 	4、topicId
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.ajaxAdd = function(req, res) {
    var content = req.body.content.replace(/\</g,'&lt').replace(/\>/g,'&gt').trim() || '',
        reply_id = req.body.reply_id || null,
        ip = req.body.ip || '',
        topicId = req.body.topicId;
    var authorId = null;

    if (req.session.user) {
        authorId = req.session.user['_id'];
    }
    if (content == '' || ip == '' || topicId == '') {
        var out = {
            status: 1010,
            msg: '必要内容不能为空!'
        };
        return res.send(out);
    }

    Topic.getTopicById(topicId, function(err, topic, author, reply) {
        if (!topic) {
            var out = {
                status: 1010,
                msg: '文章不存在!'
            };
            return res.send(out);
        }
        Reply.newAndSave(content, topicId, authorId, ip, reply_id, function(err, rep) {
            Topic.updateLastReply(topicId, rep['_id'], function(err, t) {
                var out = {
                    status: 1000,
                    msg: rep
                };
                return res.send(out);
            });
        })
    });
}

//.replace(/\</g,'&lt').replace(/\>/g,'&gt')

exports.ajaxload = function(req, res) {
    var once = require('../settings').reply_page_count;
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var topicId = req.query.topicId;

    var options = {
        skip: (page - 1) * once,
        limit: once,
        sort: '-_id'
    };
    Reply.getRepliesByQuery({
        'topic_id': topicId
    }, options, function(err, rep) {
        Reply.getCountByTopicId(topicId, function(err, count) {
        	rep.forEach(function(re){
        		re.ip = re.ip.replace(/\</g,'&lt').replace(/\>/g,'&gt');
        		re.content = re.content.replace(/\</g,'&lt').replace(/\>/g,'&gt').replace(/\n/g,'<br />');
        		return re;
        	})
            if(err){
            	var out = {status:1010,msg:'加载失败'};
            	return res.send(out);
            }
            var hNext = Math.ceil(count/once) > page;
            var out = {status:1000,data:rep,hasNext:hNext};
            res.send(out);
        });
    })


}
