var util = require('util');

var Target = require('./target');

function Adapter(encodeModule,algorithm,enstring,returnType,encodeKey,encodeType){
	Target.call(this);
	this.encode = function(encodeModule,algorithm,enstring,returnType,encodeKey,encodeType){
		var encodeModule = encodeModule ? encodeModule : null,
		algorithm = algorithm ? algorithm : null,
		enstring = enstring ? enstring : '',
		returnType = returnType ? returnType : '',
		encodeKey = encodeKey ? encodeKey : '',
		encodeType = encodeType ? encodeType : '';

		var AdapteeClass = require('./adapter_class/' + encodeModule);
		var AdapteeObj = new AdapteeClass();
		return AdapteeObj.encode(algorithm,enstring,returnType,encodeKey,encodeType);
	}

	this.decode = function(encodeModule,algorithm,enstring,returnType,encodeKey,encodeType){
		var encodeModule = encodeModule ? encodeModule : null,
		algorithm = algorithm ? algorithm : null,
		enstring = enstring ? enstring : '',
		returnType = returnType ? returnType : '',
		encodeKey = encodeKey ? encodeKey : '',
		encodeType = encodeType ? encodeType : '';
		var AdapteeClass = require('./adapter_class/' + encodeModule);
		var AdapteeObj = new AdapteeClass();
		return AdapteeObj.decode(algorithm,enstring,returnType,encodeKey,encodeType);
	}
}

module.exports = Adapter;