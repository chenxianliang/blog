var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rstring  = require('../tool/rstring');
var getTime  = require('../tool/getTime');
var ObjectId = Schema.ObjectId;

var ClsSchema = new Schema({
  content: { type: String },
  display_name: { type: String },
  sort:{type:Number},
});

ClsSchema.index({sort: 1});

mongoose.model('Cls', ClsSchema);