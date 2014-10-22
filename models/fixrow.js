function fixrow(row) {
    if(!row){
        return null;
    }
    var out = {};
    for (var attr in row) {
        out[attr] = row[attr];
    }
    if (row['_id']) {
        out.id = row['_id'];
        delete out['_id'];
    } else {
        console.log('Error:some thing wrong happend!');
    }
    return out;
}

module.exports = fixrow;