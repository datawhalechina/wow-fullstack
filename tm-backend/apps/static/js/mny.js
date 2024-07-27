"use strict";
var interval;		//定时器变量
/**
 * 封装的自定义bootstrap警示框弹出自动消失效果
 * @param type 1:成功 2：危险
 * @param msg
 * @param time 默认的是2000，即2秒
 */
function  mnyAlert(type,msg,time=2000){
	//判断页面中是否有#mny-width的dom元素，有的话将其去除
	if($('#mny-width').length > 0){
		$('#mny-width').remove();
	}
	// 先将其插入到body下
	if(type == '1'){
		$('body').append(`
		<div id="mny-width" class="alert alert-success mny-alert-position" role="alert">
			`+msg+`
		</div>
		`);
	}else if(type == '2'){
		$('body').append(`
		<div id="mny-width" class="alert alert-danger mny-alert-position" role="alert">
			`+msg+`
		</div>
		`);
	}

	//计算长度
	const mny_width = $('#mny-width').innerWidth() + 2;
	//向元素中添加内嵌样式
	$('#mny-width').css('marginLeft','-'+mny_width/2+'px');
	// console.log(time);
	//清除已存在的定时器
	clearInterval(interval)
	//将元素定时去除
	interval = window.setInterval(function () {
		$('#mny-width').remove();
	}, time);
}