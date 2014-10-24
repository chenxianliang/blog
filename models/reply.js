var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rstring  = require('../tool/rstring');
var getTime  = require('../tool/getTime');
var ObjectId = Schema.ObjectId;

var ReplySchema = new Schema({
  content: { type: String },
  topic_id: { type: ObjectId},
  author_id: { type: ObjectId },
  reply_id: { type: ObjectId },
  create_at: { type: Object, default: getTime() },
  update_at: { type: Object, default: getTime() },
  content_is_html: { type: Boolean }
});

ReplySchema.index({topic_id: 1});
ReplySchema.index({author_id: 1, create_at: -1});

mongoose.model('Reply', ReplySchema);