$(function() {
    //提交评论
    var $addCommentBtn = $('.js_addComment');
    var topicId = $('.js_hidden_topicId').val();


    var _addComment = false;
    $addCommentBtn.on('click', function() {
        if (_addComment) {
            alert('正在提交..');
            return;
        }
        _addComment = true;

        var content = $('.comment-add-txt').val();
        var username = '';
        var $hidden_ip = $('.js_hidden_ip');
        var $ip = $('.comment-add-name');

        if (content == '') {
            alert('评论内容不能为空!');
            _addComment = false;
            return;
        }

        if($('.atwrap').attr('data-id')){
            content = '@' + $('.atwrap').attr('data-user') + '  ' + content;
        }

        if (fixIp($hidden_ip.val()) == $ip.val()) {
            username = $hidden_ip.val();
        } else {
            username = $ip.val();
        }

        var data = {
            content: content,
            ip: username,
            topicId: topicId,
            reply_id: $('.atwrap').attr('data-id')
        }

        $.ajax({
            url: '/ajax/reply_add',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function(res) {
                if (res.status == 1000) {
                    $('.comment-add-txt').val('');
                    var obj = res.msg;
                    var $item = $('#js_cTemplete').find('.comment-list-item').clone();
                    $item.find('.comment-name').html(isIp(obj.ip)? fixIp(obj.ip) : obj.ip   );
                    $item.find('.comment-list-info').html(obj.content.replace(/\</g,'&lt').replace(/\>/g,'&gt').replace(/\n/g,'<br />'));
                    $item.find('.js_hidden_repId').val(obj['_id']);
                    $('.comment-list .comment-title').after($item);

                    var h = $item.outerHeight();
                    $item.height(0).css('opacity', 0).animate({
                        'height': h,
                        'opacity': 1
                    }, 300);
                } else {
                    alert('评论失败!');
                }
            },
            error: function() {
                alert('评论失败!');
            },
            complete: function() {
                initTxt();
                _addComment = false;
            }
        })
    });

    $(document).on('click','.js_call_rep', function() {
        var $pare = $(this).parents('.comment-list-item');

        var lz = $pare.find('.comment-name').html().trim();
        var txt = $pare.find('.comment-list-info').html().trim().substring(0, 18);
        var reply_id = $pare.find('.js_hidden_repId').val();
        $('.atwrap').attr('data-id', reply_id).attr('data-user',lz).find('span').html('@' + lz);
        var w = $('.atwrap').outerWidth();
        var content = txt + '\r\n-----------------------------\r\n';

        $('.comment-add-txt').val(content).html(content).css('text-indent', w + 'px');
        $('html,body').animate({scrollTop:$('.comment-add-txt').offset().top - 100},400,'',function(){
            $('.comment-add-txt').focus();
        })
    });


    function initTxt() {
        $('.comment-add-txt').val('').html('').css('text-indent', 0 + 'px');
        $('.atwrap').attr('data-id','').attr('data-user','').find('span').html('');
    }

    function fixIp(ip) {
        var arr = ip.split('.');
        return [arr[0], '**', '**', arr[3]].join('.');
    }
    function isIp(ip){
        var reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        return ip.match(reg);
    }

    var page = 2;
    var _loading = false;
    $('.comment-list-loadmore').on('click',function(){
        var self = this;
        $(self).html('正在加载中.....');
        if(_loading){
            alert('请勿重复点击');
            return;
        }
        _loading = true;
        var data = {
            topicId : topicId,
            page : page
        };
        $.ajax({
            type:'get',
            url:'/ajax/more_reply',
            data:data,
            dataType:'json',
            success: function(res) {
                if (res.status == 1000) {
                    page ++;
                    if(!res.hasNext){
                        $(self).html('没有更多评论了~').off('click');
                    }else{
                        $(self).html('加载更多');
                    }
                    res.data.forEach(function(obj,index){
                        var $item = $('#js_cTemplete').find('.comment-list-item').clone();
                        $item.find('.comment-name').html(isIp(obj.ip)? fixIp(obj.ip) : obj.ip   );
                        $item.find('.comment-list-info').html(obj.content.replace(/\</g,'&lt').replace(/\>/g,'&gt').replace(/\n/g,'<br />'));
                        $item.find('.js_hidden_repId').val(obj['_id']);
                        $item.find('.comment-time').html(obj.create_at.minute);
                        $(self).before($item);
                    })
                } else {
                    alert('加载失败!');
                }
            },
            error: function() {
                alert('加载失败!');
            },
            complete: function() {
                _loading = false;
            }
        })
    });

});
