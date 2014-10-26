var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rstring  = require('../tool/rstring');
var getTime  = require('../tool/getTime');
var ObjectId = Schema.ObjectId;

var LinksSchema = new Schema({
  url: { type: String },
  name: { type: String },
  is_lock :{type:Boolean,default:false},
  sort:{type:Number},
  create_at: { type: Object, default: getTime() },
  update_at: { type: Object, default: getTime() },
});

LinksSchema.index({is_lock: -1});

mongoose.model('Links', LinksSchema);