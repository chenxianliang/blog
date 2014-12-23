var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rstring  = require('../tool/rstring');
var getTime  = require('../tool/getTime');
var ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
  content: { type: String },
  author: { type: String },
  create_at: { type: Object, default: getTime() },
  update_at: { type: Object, default: getTime() },
  ip : {type:String},
});


mongoose.model('Message', MessageSchema);