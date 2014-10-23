//提供对外接口
var AdapterClass = require('./adapter');
/**
 * [encode description]
 * @param  {[type]} encodeModule [加密模块名：hash hmac ]
 * @param  {[type]} algorithm    [算法类型：sha1,md5,sha256,sha512]
 * @param  {[type]} enstring     [需要加密的字符串或者字符的二进制数据流]
 * @param  {[type]} returnType   [输出返回类型：hex binary,base64]
 * @param  {[type]} encodeKey    [加密使用的密钥 ，可选参数]
 * @param  {[type]} encodeType   [加密时需要的加密编码，binary,ascii,utf8]
 * @return {[type]}              [description]
 */
exports.encode = function(encodeModule,algorithm,enstring,returnType,encodeKey,encodeType){
	var encodeModule = encodeModule ? encodeModule : null,
		algorithm = algorithm ? algorithm : null,
		enstring = enstring ? enstring : '',
		returnType = returnType ? returnType : '',
		encodeKey = encodeKey ? encodeKey : '',
		encodeType = encodeType ? encodeType : '';

	var Adapter = new AdapterClass();
	return Adapter.encode(encodeModule,algorithm,enstring,returnType,encodeKey,encodeType);
}


/**
 * [decode description]
 * @param  {[type]} encodeModule [解密模块名：hash hmac ]
 * @param  {[type]} algorithm    [算法类型：sha1,md5,sha256,sha512]
 * @param  {[type]} enstring     [需要解密的字符串或者字符的二进制数据流]
 * @param  {[type]} returnType   [输出返回类型：hex binary,base64]
 * @param  {[type]} encodeKey    [解密使用的密钥 ，可选参数]
 * @param  {[type]} encodeType   [解密时需要的解密编码，binary,ascii,utf8]
 * @return {[type]}              [description]
 */
exports.decode = function(encodeModule,algorithm,enstring,returnType,encodeKey,encodeType){
	var encodeModule = encodeModule ? encodeModule : null,
		algorithm = algorithm ? algorithm : null,
		enstring = enstring ? enstring : '',
		returnType = returnType ? returnType : '',
		encodeKey = encodeKey ? encodeKey : '',
		encodeType = encodeType ? encodeType : '';

	var Adapter = new AdapterClass();
	return Adapter.decode(encodeModule,algorithm,enstring,returnType,encodeKey,encodeType);
}

