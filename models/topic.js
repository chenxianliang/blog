var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rstring  = require('../tool/rstring');
var getTime  = require('../tool/getTime');
var ObjectId = Schema.ObjectId;

var TopicSchema = new Schema({
	  title: { type: String },
	  content: { type: String },
	  author_id: { type: ObjectId },
	  top: { type: Boolean, default: false }, // 置顶帖
	  slide: {type: Boolean, default: false}, // 幻灯
	  reply_count: { type: Number, default: 0 },
	  visit_count: { type: Number, default: 0 },
	  create_at: { type: Object, default: getTime() },
	  update_at: { type: Object, default: getTime() },
	  last_reply: { type: ObjectId },
	  last_reply_at: { type: Object, default: getTime() },
	  content_is_html: { type: Boolean },
	  address : {type:String},
	  thumb_pic : {type : String},
	  arrow_reply:{type:Boolean ,default:true},
	  cls : {type:String},
	  out : {type:Boolean,default : true},
	  preview : {type:String},
});

TopicSchema.index({create_at: -1});
TopicSchema.index({top: -1, last_reply_at: -1});
TopicSchema.index({last_reply_at: -1});
TopicSchema.index({author_id: 1, create_at: -1});
TopicSchema.index({out: 1});

mongoose.model('Topic', TopicSchema);