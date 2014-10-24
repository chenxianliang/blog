$(function() {
    //提交评论
    var $addCommentBtn = $('.js_addComment');


    var _addComment = false;
    $addCommentBtn.on('click', function() {
        if (_addComment) {
            alert('正在提交..');
            return;
        }
        _addComment = true;

        var content = $('.comment-add-txt').val();
        var username = '';
        var topicId = $('.js_hidden_topicId').val();
        var $hidden_ip = $('.js_hidden_ip');
        var $ip = $('.comment-add-name');

        if(content == ''){
        	alert('评论内容不能为空!')
        	return;
        }

        if (fixIp($hidden_ip.val()) == $ip.val()) {
            username = $hidden_ip.val();
        } else {
            username = $ip.val();
        }

        var data = {
            content: content,
            ip: username,
            topicId: topicId
        }

        $.ajax({
            url: '/ajax/reply_add',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function(res) {
                if(res.status == 1000){
                	$('.comment-add-txt').val('');
                	var obj = res.msg;
                	var $item = $('#js_cTemplete').find('.comment-list-item').clone();
                	$item.find('.comment-name').html(fixIp(obj.ip));
                	$item.find('.comment-list-info').html(obj.content);
                	$('.comment-list .comment-title').after($item);
                	var h = $item.outerHeight();
                	$item.height(0).css('opacity',0).animate({'height':h,'opacity':1},300);
                }else{
                	alert('评论失败!');
                }
            },
            error: function() {

            },
            complete: function() {
                _addComment = false;
            }
        })
    });


    function fixIp(ip) {
        var arr = ip.split('.');
        return [arr[0], '**', '**', arr[3]].join('.');
    }
});
