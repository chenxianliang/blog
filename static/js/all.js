$(function(){
	//增加留言
	var $messageBtn = $('.message-add-btn');
	var $messageTxt = $('.message-add-txt');
	var $messageName = $('.message-add-name');


	var _adding = false;
	$messageBtn.on('click',function(){
		if( $messageTxt.val() == '' || $messageName.val() == '' ){
			alert('信息不能为空!');
			return;
		}
		if(_adding){
			alert('正在提交,请稍后再试~');
			return;
		}
		_adding = true;
		var data = {};
		data.author = $messageName.val();
		data.content = $messageTxt.val();
		$.ajax({
			url:'/ajax/message_add',
			data:data,
			dataType:'json',
			type:'post',
			success:function(res){
				if (res.status == 1000) {
                    $messageTxt.val('');
                    var obj = res.msg;
                    var $item = $('.js_message_templete').find('.message-item').clone();
                    $item.find('.message-name').html(obj.author);
                    $item.find('.message-info').html(obj.content);
                    $('.slider-item.message').append($item);

                    var h = $item.outerHeight();
                    $item.height(0).css('opacity', 0).animate({
                        'height': h,
                        'opacity': 1
                    }, 300);
                } else {
                    alert('评论失败!');
                }
			},
			error:function(){
				alert('评论失败!');
			},
			complete:function(){
				_adding = false;
			}
		})
	});

})