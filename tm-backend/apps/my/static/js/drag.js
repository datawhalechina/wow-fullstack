/**
 * 按格子移动，数据格式为日期
 */
(function($) {
	'use strict';
	$.fn.initJuicy = function(data) {
		return new MyinitJuicy(data, this);
	};
	var perheight = 0;
	var MyinitJuicy = function(data, that) {
		var me = this;
		me.init(data, that);
		me.offsettop = $(that).offset().top;
	};
 
	// 返回选择的日期
	MyinitJuicy.prototype.getdata = function() {
		var backdata = [];
		var monday = $(".kaoqing").data("monday");
		$.each($(".weekday"), function(i, obj) {
			var thisday = getNextDate(monday, i);
			$.each($(obj).find(".item"), function(j, obj1) {
				var x = parseFloat($(obj1).css("top")) / perheight;
				var y = parseFloat($(obj1).css("height")) / perheight + x;
				var startime = Math.round(x) % 2 == 0 ? (thisday + " " +  ("0"+Math.round(x) / 2).slice(-2) + ":00:00") : (thisday + " " + ("0"+ parseInt(Math.round(x) / 2)).slice(-2) + ":30:00");
				var endtime = Math.round(y) % 2 == 0 ? (thisday + " " + ("0"+Math.round(y) / 2).slice(-2) + ":00:00") : (thisday + " " + ("0"+parseInt(Math.round(y) / 2)).slice(-2) + ":30:00");
				backdata.push({
					startime: startime,
					endtime: endtime
				});
			});
 
		})
		return backdata;
	}
	// 初始化
	MyinitJuicy.prototype.init = function(data, that) {
		var me = this;
		me.current = 0; //新增编号
		me.cando = true; //当前位置是否允许新增
		me.nowmove = -1; //当前拖动的序号
		me.newcreate = true;
		me.opts = $.extend(true, {}, { //用于设弹窗默认值
			height: 900,
			mondayDate: '',
			timedata: [], //[{startime:,endtime:},]
			status: true,
			data1: [{
				"type": "周一",
				"timeSlot": []
			}, {
				"type": "周二",
				"timeSlot": []
			}, {
				"type": "周三",
				"timeSlot": []
			}, {
				"type": "周四",
				"timeSlot": []
			}, {
				"type": "周五",
				"timeSlot": []
			}, {
				"type": "周六",
				"timeSlot": []
			}, {
				"type": "周日",
				"timeSlot": []
			}]
		}, data);
		me.mousedown = false;
		//初始化
		var str = '';
		var boxheight = me.opts.height;
		var navheight = me.opts.height - 50;
		me.perheight = perheight = navheight / 48;
		$(that).css("height", boxheight + "px");
		$(that).attr("data-monday", me.opts.mondayDate);
		var data3 = me.opts.timedata;
		var timedata = me.opts.data1;
	
		for(var i = 0; i < 7; i++) {
			timedata[i]["type"] += getNextDay(me.opts.mondayDate, i);
		}
		
		$.each(data3, function(i, obj) {
			var day = new Date(obj.startime.replace(/-/g,"/")).getDay() - 1;
			if(day == -1) day = 6;
			timedata[day]["timeSlot"].push([getMytime(obj.startime), getMytime(obj.endtime)]);
		});
 
		for(var i = 0; i < 1; i++) {
			str += '<div class="weekday">' +
				'<div>' +
				'<div class="day">';
			for(var j = 0; j < 24; j++) {
				str += '<div class="hour" style="top:'+me.perheight * 2 * j+'px;"><div class="halfhour"></div></div>';
			}
			str += '<div class="hour" style="top:'+me.perheight * 2 * 24+'px;"></div></div><div class="bar">';
			if(timedata.length == 0) {
				str += '</div></div></div>';
			} else {
				for(var t = 0; t < timedata[i].timeSlot.length; t++) {
					var top = navheight * timedata[i].timeSlot[t][0] / 24;
					var height = navheight * (timedata[i].timeSlot[t][1] - timedata[i].timeSlot[t][0]) / 24;
					str += '<div class="item item' + me.current + '" style="top:' + top + 'px;height:' + height + 'px" data-num="' + me.current + '">' +
						'<div class="bup"></div><div class="bdown"></div></div>';
					me.current++;
				}
				str += '</div></div></div>';
			}
		}
 
		var $str = $(str);
		$(that).append($str);
		//点在蓝条条上就禁止它新建了
		if(me.opts.status) {
			$(".bup").css("cursor", "n-resize");
			$(".bdown").css("cursor", "s-resize");
			$str.find(".item").on('mousedown', function(e) {
				me.cando = false;
				return false;
			})
			$str.find(".bar").on('mousedown', function(e) {
				if(me.cando) {
					me.mousedown = true;
					me.newcreate = true;
					fnstart(e, me, this);
				}
				return false; //防止事件冒泡
			});
			$("body").on('mouseup', function(e) {
				me.cando = true;
				if(me.mousedown) {
					me.mousedown = false;
					fnend(me);
					me.nowmove = -1;
				}
				return false; //防止事件冒泡
			});
 
			$str.find(".bdown").on('mousedown', function(e) {
				me.mousedown = true;
				me.newcreate = false;
				me._startY = e.pageY;
				me.direction='down';
				me.height = parseFloat($(this).parent().css("height")); //会实时变化
				me.top = parseFloat($(this).parent().css("top")); //会实时变化
				me.startheight = parseFloat($(this).parent().css("height")); //是个常数
				me.starttop = parseFloat($(this).parent().css("top")); //是个常数
				me.nowmove = parseFloat($(this).parent().data("num"));
				return false;
			})
			$str.find(".bup").on('mousedown', function(e) {
				me.mousedown=true;
				me.newcreate = false;
				me._startY = e.pageY;
				me.direction='up';
				me.height = parseFloat($(this).parent().css("height")); //会实时变化
				me.top = parseFloat($(this).parent().css("top")); //会实时变化
				me.startheight = parseFloat($(this).parent().css("height")); //是个常数
				me.starttop = parseFloat($(this).parent().css("top")); //是个常数
				me.nowmove = parseFloat($(this).parent().data("num"));
				return false; 
			})
			//注意：move事件一定要绑在body上，当鼠标移动过快可能移除那个div区域
			$("body").on('mousemove', function(e) {
				if(me.mousedown && me.newcreate) {
					fnmove(e, me);
				} else if(me.mousedown && !me.newcreate) {
					if(me.direction&&me.direction=='up'){
						fnmoveup(e, me);
					}else if(me.direction&&me.direction=='down'){
						fnmovedown(e, me);
					}
				} else {
					e.preventDefault()
				}
 
			});
		} else {
			$(".bdown,.bup").css("cursor", "default");
		}
 
	};
	function fnmoveup(e, me) {
		me._curX = e.pageX;
		me._curY = e.pageY;
		me._moveY = me._startY - me._curY;
		var item = ".item" + me.nowmove;
		var top= me.starttop-me._moveY;
		var height = me.startheight + me._moveY;
		//左边的向左拉，不超过左边边界
		if(me._moveY > 0 && me._moveY < me.starttop) {
			$(item).css({
				"height": height + 'px',
				"top": top + 'px'
			})
			me.height = height;
			me.top = top;
		} else if(me._moveY > 0 && me._moveY >= me.starttop) { //左边的向左拉，超过左边边界
			$(item).css({
				"height": (me.starttop+me.startheight) + 'px',
				"top": 0
			})
			me.height = me.starttop+me.startheight;
			me.top = 0;
		} else if(me._moveY < 0 && -me._moveY <= me.startheight) { //左边的向右拉,不能超过当前右边的0.5小时
			$(item).css({
				"height": height + 'px',
				"top": top + 'px'
			})
			me.height = height;
			me.top = top;
		} else if(me._moveY < 0 && -me._moveY > me.startheight) { //左边的向右拉,超过最右边
			$(item).css({
				"height": 0,
				"top": (me.startheight + me.starttop)+ 'px'
			})
			me.height = 0;
			me.top = me.startheight + me.starttop;
		}
	}
	function fnmovedown(e, me) {
		me._curX = e.pageX;
		me._curY = e.pageY;
		me._moveY = me._curY - me._startY;
		var item = ".item" + me.nowmove;
		var top = me.starttop;
		var height = me.startheight + me._moveY;
		//右边的向右拉，不超过右边边界
		if(me._moveY > 0 && me._moveY < me.perheight * 48 - me.starttop - me.startheight) {
			$(item).css({
				"height": height + 'px',
				"top": top + 'px'
			})
			me.height = height;
		} else if(me._moveY > 0 && me._moveY >= me.perheight * 48 - me.starttop - me.startheight) { //右边的向右拉，超过右边边界
			$(item).css({
				"height": (me.perheight * 48 - top) + 'px',
				"top": top + 'px'
			})
			me.height = me.perheight * 48 - top;
		} else if(me._moveY < 0 && -me._moveY <= me.startheight) { //右边的向左拉,不能超过当前左边的0.5小时
			$(item).css({
				"height": height + 'px',
				"top": top + 'px'
			})
			me.height = height;
		} else if(me._moveY < 0 && -me._moveY > me.startheight) { //右边的向左拉,超过最左边
			$(item).css({
				"height": 0,
				"top": top + 'px'
			})
			me.height = 0;
		}
	}
	
	function fnstart(e, me, that) {
		me._startY = e.pageY;
		var top = me._startY - me.offsettop;
		me.top = nearest(top);
		me.starttop = nearest(top);
		me.nowmove = me.current;
		var str = '<div class="item item' + me.current + '" style="top:' + me.top + 'px;height:1px"  data-num="' + me.current + '">' +
			'<div class="bup"></div><div class="bdown"></div></div>';
		me.current++;
		var item = ".item" + (me.current - 1);
		$(that).append($(str));
		if(me.opts.status) {
			$(".bup").css("cursor", "n-resize");
			$(".bdown").css("cursor", "s-resize");
			$(item).on('mousedown', function(e) {
				me.cando = false;
				return false;
			})
 
			$(item).find(".bdown").on('mousedown', function(e) {
				me.mousedown = true;
				me.newcreate = false;
				me._startY = e.pageY;
				me.direction='down';
				me.height = parseFloat($(this).parent().css("height")); //会实时变化
				me.top = parseFloat($(this).parent().css("top")); //会实时变化
				me.startheight = parseFloat($(this).parent().css("height")); //是个常数
				me.starttop = parseFloat($(this).parent().css("top")); //是个常数
				me.nowmove = parseFloat($(this).parent().data("num"));
				return false;
			})
			$(item).find(".bup").on('mousedown', function(e) {
				me.mousedown=true;
				me.newcreate = false;
				me._startY = e.pageY;
				me.direction='up';
				me.height = parseFloat($(this).parent().css("height")); //会实时变化
				me.top = parseFloat($(this).parent().css("top")); //会实时变化
				me.startheight = parseFloat($(this).parent().css("height")); //是个常数
				me.starttop = parseFloat($(this).parent().css("top")); //是个常数
				me.nowmove = parseFloat($(this).parent().data("num"));
				return false; 
			})
		} else {
			$(".bup,.bdown").css("cursor", "default");
		}
 
	}
 
	function fnmove(e, me) {
		me._curX = e.pageX;
		me._curY = e.pageY;
		me._moveY = me._curY - me._startY;
		var item = ".item" + (me.current - 1);
		if(me._moveY > 0 && me._moveY < me.perheight * 48 - me.starttop) {
			me.height = me._moveY;
			$(item).css("height", me._moveY + 'px');
//			$(item).css("height", me._moveY + 'px')
		} else if(me._moveY > 0 && me._moveY >= me.perheight * 48 - me.starttop) {
			me.height = me.perheight * 48 - me.starttop;
			$(item).css("height", (me.perheight * 48 - me.starttop) + 'px')
		} else {
			me.height = 0;
			$(item).css("height", 0)
		}
	}
 
	function fnend(me, i) {
		var height = me.height;
		var top = me.top;
		var item = ".item" + me.nowmove;
		if(height == 0) {
			$(item).remove();
		} else {
			$(item).css("height", nearest(height) + "px");
			$(item).css("top", nearest(top) + "px");
			var result = xiaoxiannvbianshen(item);
			var items = $(item).parent().find(".item");
			if(result.length < items.length) {
				$.each(items, function(i, obj) {
					if(i < result.length) {
						$(obj).css({
							"top": result[i][0] + 'px',
							"height": result[i][1] + 'px'
						})
					} else {
						$(obj).remove();
					}
				});
			}
		}
		//松手后才能修改值
	}
 
	// 计算贴近的位置
	function nearest(top) {
		var yu = top % perheight;
		if(yu < perheight / 2) {
			return top - yu;
		} else {
			return top + (perheight - yu);
		}
	}
 
	function getMytime(date) {
		if(date.split(" ")[1] == "24:00:00") {
			return 24;
		} else {
			var time = new Date(date.replace(/-/g,"/"));
			if(time.getMinutes() > 10) {
				return time.getHours() + 0.5;
			} else {
				return time.getHours();
			}
		}
 
	}
 
	// 返回月日
	function getNextDay(d, i) {
		var monday = new Date(d.replace(/-/g,"/"));
		monday = monday.getTime() + 1000 * 60 * 60 * 24 * i;
		monday = new Date(monday);
		return (monday.getMonth() + 1) + "/" + monday.getDate();
	}
 
	// 返回年月日
	function getNextDate(d, i) {
		var monday = new Date(d.replace(/-/g,"/"));
		monday = monday.getTime() + 1000 * 60 * 60 * 24 * i;
		monday = new Date(monday);
		return monday.getFullYear() + "-" + ("0"+(monday.getMonth() + 1)).slice(-2) + "-" + ("0"+monday.getDate()).slice(-2);
	}
 
	function xiaoxiannvbianshen(item) {
		var array = [];
		var arrayresult = [];
		var $item = $(item).parent().find(".item");
		$.each($item, function(i, obj) {
			var top = parseFloat($(obj).css("top"));
			var height = parseFloat($(obj).css("height"));
			array.push([top, top + height]);
		});
		var sortarray = bubbleSort(array);
		//var sortarray = array.sort();
		var temp = sortarray[0];
		for(var i = 0; i < sortarray.length; i++) {
			if(!sortarray[i + 1]) {
				arrayresult.push(temp);
				break
			}
			if(temp[1] < sortarray[i + 1][0]) {
				arrayresult.push(temp);
				temp = sortarray[i + 1];
			} else {
				if(temp[1] <= sortarray[i + 1][1]) {
					temp = [temp[0], sortarray[i + 1][1]];
				} else {
					temp = [temp[0], temp[1]];
				}
			}
		}
		var huanyuan = [];
		for(var j = 0; j < arrayresult.length; j++) {
			huanyuan.push([arrayresult[j][0], arrayresult[j][1] - arrayresult[j][0]]);
		}
		return huanyuan;
	}
 
	function bubbleSort(array) {
		for(var unfix = array.length - 1; unfix > 0; unfix--) {
			for(var i = 0; i < unfix; i++) {
				if(array[i][0] > array[i + 1][0]) {
					var temp = array[i];
					array.splice(i, 1, array[i + 1]);
					array.splice(i + 1, 1, temp);
				}
			}
		}
		return array;
	}
})(window.Zepto || window.jQuery)