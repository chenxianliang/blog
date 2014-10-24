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
exports.ajaxAdd = function(req,res){
	var content = req.body.content || '',
		reply_id = req.body.reply_id || 0,
		ip = req.body.ip || '',
		topicId = req.body.topicId;

	var authorId = 0;

	if(req.session.user){
		authorId = req.session.user['_id'];
	}
	if( content == ''  || ip =='' || topicId == ''){
		var out = {status:1010,msg:'必要内容不能为空!'};
		return res.send(out);
	}	

	Topic.getTopicById(topicId, function(err, topic, author, reply) {
        if (!topic) {
            var out = {status:1010,msg:'文章不存在!'};
			return res.send(out);
        }
        Reply.newAndSave(content, topicId, authorId, reply_id,ip, function(err,rep){
        	var out = {status:1000,msg:rep};
			return res.send(out);
		})
    });
}