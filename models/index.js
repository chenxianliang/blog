var mongoose = require('mongoose');
var config = require('../settings');
var hostname = config.host,
	dbname = config.db;
var dburl = 'mongodb://'+ hostname +'/'+dbname;

mongoose.connect(dburl, function (err) {
  if (err) {
    console.error('connect to %s error: ', dburl, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./topic');
require('./reply');
require('./cls');
require('./message');	

exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
exports.Reply = mongoose.model('Reply');
exports.Cls = mongoose.model('Cls');
exports.Message = mongoose.model('Message');