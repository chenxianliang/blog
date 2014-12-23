var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rstring  = require('../tool/rstring');
var getTime  = require('../tool/getTime');
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	  name: { type: String},
	  loginname: { type: String},
	  pass: { type: String },
	  tmppass:{type:String ,default:rstring(12)},
	  email: { type: String},
	  is_lock: { type: Boolean,default:false }
});

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});

mongoose.model('User', UserSchema);