var crypto = require('crypto');

module.exports = function(){
	this.encode = function(algorithm,enstring,returnType,encodeKey){
		var hmac = crypto.createHmac(algorithm,encodeKey);
		hmac.update(new Buffer(enstring,'binary'));
		return hmac.digest(returnType);
	}
	this.decode = function(algorithm,enstring,returnType,encodeKey){
		console.log('hash has no decode function');
	}
}