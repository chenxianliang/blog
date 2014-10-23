var crypto = require('crypto');

module.exports = function(){
	this.encode = function(algorithm,enstring,returnType){
		var hash  = crypto.createHash(algorithm);
		hash.update(enstring);
		return hash.digest(returnType);
	}
	this.decode = function(algorithm,enstring,returnType){
		console.log('hash has no decode function');
	}
}

