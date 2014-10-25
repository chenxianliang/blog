exports.getip = function (req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var ip2 = exports.fixip(ip);
    return [ip,ip2];
};


exports.fixip = function(ip){
    var arr = ip.split('.');
    return [arr[0],'**','**',arr[3]].join('.');
}