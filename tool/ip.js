exports.getip = function (req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
    var ip2 = exports.fixip(ip);
    return [ip,ip2];
};


exports.fixip = function(ip){
	if(!ip){
		return '';
	}
    var arr = ip.split('.');
    return [arr[0],'**','**',arr[3]].join('.');
}