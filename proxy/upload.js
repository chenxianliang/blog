var path = require('path');
var fs = require('fs');


exports.img = function(req, res) {
    var patharray = req.files.file.path.split("\\");

    var fileName = getFormatDate() + path.extname(req.files.file.path);

    var target_path = path.join(BASENAME, '/public/upload/short/' + fileName);
    fs.rename(req.files.file.path, target_path, function(err) {
        if (err) {
            return console.log(err);
            res.send('error');
        }
        res.send('/upload/short/' + fileName);
    })
}


function getFormatDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = fixNumber(date.getMonth() + 1);
    var day = fixNumber(date.getDate());
    var hour = fixNumber(date.getHours());
    var min = fixNumber(date.getMinutes());
    var sec = fixNumber(date.getSeconds());
    var msec = date.getMilliseconds();
    return '' + year + month + day + hour + min + sec + msec;
}

function fixNumber(num) {
    if (num.toString().length == 1) {
        return '0' + num;
    }
    return num;
}
