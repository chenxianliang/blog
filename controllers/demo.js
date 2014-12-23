exports.lottery = function(req,res){
	var lottery = [1,2,3,4];
	var d = lottery[Math.floor( Math.random()*lottery.length )];
	var out = JSON.stringify({'code':'1000','lottery':d});
	return res.send(out);
}