function rstring(num) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var code = '';
    for (var i = 0; i < num; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        code += chars.substring(rnum, rnum + 1);
    } 
    return code;
}

module.exports = rstring;