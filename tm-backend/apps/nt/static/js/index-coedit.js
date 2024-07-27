/*数据格式说明
     node {
		    id,        //  : string                    节点id, [必选] ID, 所有节点的ID不应有重复，否则ID重复的结节将被忽略
		    index,     //  : integer                   节点序号
		    topic,     //  : string                    节点主题,	[必选] 节点上显示的内容
		    isroot,    //  : boolean                   指示该节点是否为根节点
		    parent,    //  : node                      该节点的父节点，根节点的父节目为 null ，但请不要根据此属性判断该节点是否为根节点
		    direction, //  : enum(left,center,right)   该节点的分布位置,	默认为 right
		    children,  //  : array of node             该节点的子节点组合
		    expanded,  //  : boolean                   该节点的下级节点是否展开,	默认为 true
		    data,      //  : object{string,object}     该节点的其它附加数据
		    remarkText, //备注内容
		    fileInfo, 	//附件信息
		}        
*/
/*var mind = {
	//	元数据，定义思维导图的名称、作者、版本等信息
	"meta": {
		"name": "example",
		"author": "hizzgdev@163.com",
		"version": "0.2"
	},
	//数据格式声明 
	"format": "node_array",
	//数据内容 
	"data": [{
		"id": "root",
		"isroot": true,
		"topic": "根节点"
	}, ]
};
*/
var ws_url="ws://192.168.70.128:8094/nt/ws/";
var ws =null;
var username;
var mind = null; //初始数据
var jm = null; //思维图对象
var thisNodeData = null; //当前节点数据
//var newmarksId = []; //新增的备注或附件标记

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 ;
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
return "";
}



$(document).ready(function() {
	username = "liwei";
	var c_name = "username";
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
		{ 
		c_start=c_start + c_name.length+1 ;
		c_end=document.cookie.indexOf(";",c_start);
		if (c_end==-1) c_end=document.cookie.length;
		username = document.cookie.substring(c_start,c_end);
		} 
	  }
	console.log(document.cookie);
	ws = new WebSocket(ws_url+"?un="+username+"&gid=gerbrau");
	ws.onmessage=function(serv_msg){
		msg=JSON.parse(serv_msg.data);
		var send_source = msg["send_user"];
		if (typeof(msg["send_msg"])=="object"){
			dicc = msg["send_msg"];
		}
		else{
			dicc = JSON.parse(msg["send_msg"]);
		}
		
		console.log(dicc);
		if (dicc['action']=='addchild'){
			Cnode = jm.get_node(dicc['basenodeid']);
			jm.add_node(Cnode, dicc['newnodeid'], dicc['topic']);
		}
		else if (dicc['action']=='addsub'){
			Cnode = jm.get_node(dicc['basenodeid']);
			jm.insert_node_after(Cnode, dicc['newnodeid'], dicc['topic']);
		}
		else if (dicc['action']=='delnode'){
			Cnode = jm.get_node(dicc['delid']);
			jm.remove_node(Cnode);
		}
		else if (dicc['action']=='update'){
			jm.update_node(dicc['upid'], dicc['topic']);
			jm.set_edit_info(dicc['upid'], dicc['editor'], dicc['edittime']);
		}
		else if (dicc['action']=='editing'){
			window.setTimeout(function(){
						jm.set_node_color(dicc['editid'],'#ffffff',null);
						},500);
			jm.set_node_color(dicc['editid'],'#ffff00',null);
		}
		else if (dicc['action']=='addremark'){
			var remarkNode1 = $('remark[nodeid="rmk_' + dicc['remarkid'] + '"]');
			if(remarkNode1.length > 0) {
			//修改备注
			remarkNode1.attr('title', dicc['remarkcontent']);
			} else {
				//新增备注
				//console.log(dicc['remarkid']);
				var selectedNode1 = jm.get_node(dicc['remarkid']);	
				
				//console.log(typeof(selectedNode1));
				//$(selectedNode1).addClass('remarknote');
				var addRemarkNode1 = $('<remark class="remarksN" nodeid="rmk_' + dicc['remarkid'] + '" title="' + dicc['remarkcontent'] + '"></remark>');
				//console.log(selectedNode1.topic);
				//console.log(typeof(addRemarkNode1));
				var mindMarkBox1 = $(selectedNode1._data.view.element).children('.mindMarkBox');
				//console.log(typeof(mindMarkBox1));
				$(mindMarkBox1).prepend(addRemarkNode1);
				$(mindMarkBox1).css('height', '20px');
				selectedNode1.data.remarkText = dicc['remarkcontent'];
				console.log("新增了备注");
				console.log(addRemarkNode1);
			}
			
		}
		else if (dicc['action']=='delremark'){
			var nodeid = dicc['remarkid']; //要删除备注的节点的id	
			var rmkNode = $('remark[nodeid="rmk_' + nodeid + '"]'); //得到备注节点
			var rmkparentNode = $(rmkNode).parent();
			console.log(typeof(rmkparentNode));
			rmkNode.remove(); //移除当前备注节点
			$(rmkparentNode).css('height', '0');
			//thisNodeData.data.remarkText = null; //置空当前备注数据
		}
		else if (dicc['action']=='login_data'){
			$('.user-name').text(dicc['LoginDict']['name']);
			$('.user-info').text(dicc['LoginDict']['details']);
			ChatData['user']=dicc['LoginDict'];
			
		}
		else if (dicc['action']=='online_data'){
			for (var obj in dicc['OnlineDict']) {
			ChatData[obj] = dicc['OnlineDict'][obj];
			}
			console.log(ChatData);
			LoadChatData();
		}
		else if (dicc['action']=='new_member'){
			ChatData[send_source]=dicc['member_data'];
			var li = document.createElement("li");
			li.className="contacts-item";
			li.id = send_source+"-cha";
			li.setAttribute("onclick","enterchat(this)");
			var img = document.createElement("img");
			img.src=dicc['member_data']['imgurl'];
			img.className="contacts-img";
			img.alt="avatar";
			var div1 = document.createElement("div");
			var div2 = document.createElement("div");
			var div3 = document.createElement("div");
			div1.className="contacts-person";
			div2.className="contacts-name";
			div3.className="contacts-info";
			div2.innerHTML=dicc['member_data']['name'];
			div3.innerHTML=dicc['member_data']['details'];
			li.appendChild(img);
			div1.appendChild(div2);
			div1.appendChild(div3);
			li.appendChild(div1);
			$('.contacts-list').append(li);
		}
		else if (dicc['action']=='chatmsg'){
			console.log(send_source);
			console.log(dicc['target']);
			console.log(dicc['chatcontent']);
				var ChatPart;
		        if (dicc['target']=='crowdall'){
		        	ChatPart = 'crowdall';
		        }
		        else{
		        	ChatPart = send_source;
		        }

		        var ChatConter =  document.getElementById('divid');
		        var ChatConterId = ChatConter.innerHTML;
		        var daynow = new Date();
		        var timenow = daynow.Format("yyyy-MM-dd HH:mm:ss");

		    	if (ChatPart==ChatConterId && $('#chat-window').css('display') == 'block'){
				var li = document.createElement("li");
		        var img1 = document.createElement("img");
		        img1.src=ChatData[send_source]['imgurl'];
		        img1.alt="avatar";
		        var div1 = document.createElement("div");
		        var div2 = document.createElement("div");
		        img1.className="left-img";
		        div1.className="message-data-left";
		        div2.className="other-message";
		        var span2 = document.createElement("span");
		        var br1 = document.createElement("br");
		        span2.className="message-data-time";
		        span2.innerHTML=timenow.slice(11,16);

		        if (ChatPart=='crowdall'){
			        var span1 = document.createElement("span");
			        span1.className="message-data-name";
			        span1.innerHTML=ChatData[send_source]['name']+" ";
			        div1.appendChild(span1); 
		        }

		        li.appendChild(img1);
		        div1.appendChild(span2);
		        div1.appendChild(br1);
		        div2.innerHTML=dicc['chatcontent'];
		        div1.appendChild(div2);
		        li.appendChild(div1);
		        $("#huihua").append(li);
		        console.log(li);
		        var huadong = document.getElementById('hist');
		        huadong.scrollTop = huadong.scrollHeight;
		        }
		        

		        

		        if (!DialogData.hasOwnProperty(ChatPart)){
		        	DialogData[ChatPart] = [];
		        }
		        var MyChatMessage = {};
		        MyChatMessage['source'] = send_source;
		        MyChatMessage['message_time'] = timenow;
		        MyChatMessage['message_text'] = dicc['chatcontent'];

		        DialogData[ChatPart].push(MyChatMessage);



		        if($('#'+ChatPart+'-dia').children().length<1){
		        	var li = document.createElement("li");
					li.className="active-item";
					li.id = ChatPart+'-dia';
					li.setAttribute("onclick","enterchat(this)");
					var img = document.createElement("img");
					img.src=ChatData[send_source]['imgurl'];
					img.className="active-img";
					img.alt="avatar";
					var div0 = document.createElement("div");
					var div1 = document.createElement("div");
					var div2 = document.createElement("div");
					var div3 = document.createElement("div");
					div0.className="notices";
					div0.style.display = "none";
					div1.className="active-person";
					div2.className="active-name";
					div3.className="active-info";
					div2.innerHTML=ChatData[send_source]['name'];
					div3.innerHTML=DialogData[ChatPart].slice(-1)[0]['message_text'];
					li.appendChild(img);
					div1.appendChild(div2);
					div1.appendChild(div3);
					li.appendChild(div0);
					li.appendChild(div1);
					$('.active-list').append(li);
					console.log("插入新的");
		        	$('#'+ChatPart+'-dia').insertAfter($('#crowdall-dia'));
		        }
		        else{
		        	$('#'+ChatPart+'-dia').insertAfter($('#crowdall-dia'));
		        	$('#'+ChatPart+'-dia').find('.active-info').html(dicc['chatcontent']);
		        }

		        if (ChatPart!=ChatConterId || $('#chat-window').css('display') == 'none'){
		        	var noticeBox=document.getElementById(ChatPart+'-dia');
					if (noticeBox){
						var getSecondChild = noticeBox.children[1];
						if (getSecondChild.className = "notices"){
							getSecondChild.style.display = "block";
						}
					}
		        }

		}
		else {
			console.log(dicc['action']);
		}
		
		
	};
})




$(document).ready(function() {
	mind = testData;
	jm = new jsMind(options);
	jm.show(mind);
	rightMenuFn(); //鼠标右键事件
	remarkMove(); //备注弹框移动
	downloadFile.btnClick(); //导出数据文件到本地
	$('.contacts-list').html('');
	$('.active-list').html('');
	
})

function tryprint() {
	console.log("尝试打印");
}

function genuuid(){
	var genedid = (new Date().getTime().toString(16) + Math.random().toString(16).substr(2)).substr(2, 16);
	console.log(genedid);
	$('#newgraph').attr('href',"/bebrain/brains/"+genedid);
}


function zoomIn() {
	jm.view.zoomIn();
}

function zoomOut() {
	jm.view.zoomOut();
}

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};


function countTime() {
	var selected_node = jm.get_selected_node();
	if (selected_node) {
		var operatons = {};
		operatons['action']='editing';
		operatons['editid']=selected_node.id;
		ws.send(JSON.stringify(operatons));
		console.log("正在编辑："+selected_node.id);
		console.log("主题是："+selected_node.topic);
	}
	setTimeout(countTime,1000);
}


//rightMenuFn(); //鼠标右键事件
function rightMenuFn() {
	// 右键鼠标
	var rightMenu = document.getElementById('right_menu');
	var rightScope = document.getElementById('jsmind_container');
	//var rightScope = document.getElementsByTagName('html')[0];

	rightScope.oncontextmenu = function(e) {
		var e = event || window.event;
		rightMenu.style.position = 'fixed';
		rightMenu.style.display = "block";
		rightMenu.style.left = e.clientX + 'px';
		rightMenu.style.top = e.clientY + 'px';
		return false; //取消右键点击的默认事件
	}

	document.onclick = function() {
		rightMenu.style.display = "none";
	}
}

var options = {
	container: 'jsmind_container', // [必选] 容器的ID
	editable: true, // 是否启用编辑,添加、删除、修改、移动
	theme: 'clouds', // 主题,15中主题可选,	[primary,warning,danger,success,info,greensea,nephrite,belizehole,wisteria,asphalt,orange,pumpkin,pomegranate,clouds,asbestos]
	mode: 'full', // 显示模式,full两侧分步、side右侧分步
	support_html: true, // 是否支持节点里的HTML元素
	view: {
		hmargin: 100, // 思维导图距容器外框的最小水平距离，px
		vmargin: 50, // 思维导图距容器外框的最小垂直距离
		line_width: 1, // 思维导图线条的粗细
		line_color: '#666' // 思维导图线条的颜色
	},
	layout: {
		hspace: 30, // 节点之间的水平间距
		vspace: 22, // 节点之间的垂直间距
		pspace: 13 // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
	},
	shortcut: {
		enable: true, // 是否启用快捷键
		handles: {}, // 命名的快捷键事件处理器
		mapping: { // 快捷键映射
			addchild: 45, // <Insert>
			addbrother: 118, // <Enter>
			editnode: 113, // <F2>
			delnode: 46, // <Delete>
			toggle: 32, // <Space>
			left: 37, // <Left>
			up: 38, // <Up>
			right: 39, // <Right>
			down: 40, // <Down>
		}
	},
};

function delete_node() {
	// 删除节点
	var tempid = '';
	var selected_node = jm.get_selected_node(); //选中的节点
	// 判断是否有选中节点
	if(!selected_node) {
		alert('请选择一个节点');
		return;
	}
	if(selected_node.id == 'root') {
		alert('根节点不能删除');
	} else {
		var childNode = selected_node.children;
		if(childNode != '') {
			//判断是否有子节点                        
			if(confirm("该节点下包含子节点，您确定删除吗？")) {
				tempid = selected_node.id;
				jm.remove_node(selected_node); //删除选中的节点
			}
		} else {
			tempid = selected_node.id;
			jm.remove_node(selected_node); //删除选中的节点
		}
	}
	operatons = {};
	operatons['action']='delnode';
	operatons['delid']=tempid;
	ws.send(JSON.stringify(operatons));
	deleted.push(tempid);

}
/*//递归遍历子集节点
function eachId(arr, nodeId) {
	for(var i = 0; i < arr.length; i++) {
		for(var a in arr[i]) {
			if(a == "id") {
				nodeId.push(arr[i][a]);
			}
			if(a == "children") {
				eachId(arr[i][a], nodeId); //递归遍历
			}
		}
	}
}*/

function add_node() {
	// 新增子节点
	var selected_node = jm.get_selected_node(); //选中的节点
	// 判断是否有选中节点
	if(!selected_node) {
		alert('请选择一个节点');
		return;
	}
	var nodeid = jsMind.util.uuid.newid(); //节点id
	var topic = "新节点"; //新节点标题
	jm.add_node(selected_node, nodeid, topic); //在选中的节点下新增子节点
	operatons = {};
	operatons['action']='addchild';
	operatons['basenodeid']=selected_node.id;
	operatons['newnodeid']=nodeid;
	operatons['topic']=topic;
	ws.send(JSON.stringify(operatons));
}

function add_subNode() {
	// 新增同级节点
	var selected_node = jm.get_selected_node(); //选中的节点
	// 判断是否有选中节点
	if(!selected_node) {
		alert('请选择一个节点');
		return;
	}
	var nodeid = jsMind.util.uuid.newid(); //节点id
	var topic = "新节点"; //新节点标题
	if(selected_node.id == 'root') {
		alert('根节点不能添加同级节点');
	} else {
		jm.insert_node_after(selected_node, nodeid, topic); //在选中的节点下新增子节点
	}
	operatons = {};
	operatons['action']='addsub';
	operatons['basenodeid']=selected_node.id;
	operatons['newnodeid']=nodeid;
	operatons['topic']=topic;
	ws.send(JSON.stringify(operatons));
}

function showRemark() {
	//显示备注
	var selected_node = jm.get_selected_node(); //选中的节点
	// 判断是否有选中节点
	if(!selected_node) {
		alert('请选择一个节点');
		return;
	}

	var nodeid = selected_node.id; //选中节点的id		
	var remarkBox = document.getElementById('remark_box'); //备注弹框
	var remarkInput = document.getElementById('remark_input'); //文本域	
	var editinfo = document.getElementById('edit_info'); //编辑信息域	
	var remarkNode = $('remark[nodeid="rmk_' + nodeid + '"]'); //当前备注节点
	console.log(remarkNode);
	console.log(remarkNode.attr('title'));
	var selectedNode = $('.selected'); //当前选中节点	
	editinfo.innerHTML = null;
	if(!!selected_node.data['editor']){
	editinfo.innerHTML = selected_node.data['editor'] + "编辑于" + selected_node.data['time'];
	}
	//jm.select_clear(); //清除节点选中
	selectedNode.addClass('selected'); //给当前选中节点添加类	

	//判断是否有备注，并进行内容赋值
	if(remarkNode.length > 0) {
		//修改备注
		var remarkText = remarkNode.attr('title');
		remarkInput.value = remarkText;
	} else {
		//新增备注
		remarkInput.value = '';
	}
	remarkBox.style.display = 'block';
	remarkBtnClick(remarkBox, remarkNode, nodeid, remarkInput, selected_node); //备注确定和取消
}

function remarkBtnClick(remarkBox, remarkNode, nodeid, remarkInput, selected_node) {
	//备注确定和取消	
	var remarkCanaelBtn = document.getElementById('remark_canaelBtn'); //取消按钮
	var remarkSureBtn = document.getElementById('remark_sureBtn'); //确定按钮

	//取消
	remarkCanaelBtn.onclick = function() {
		remarkBox.style.display = 'none';
		//jm.select_node(selected_node); //选中节点
	}

	//确定
	remarkSureBtn.onclick = function() {
		if(remarkNode.length > 0) {
			//修改备注
			remarkNode.attr('title', remarkInput.value);
		} else {
			//新增备注
			var addRemarkNode = $('<remark class="remarksN" nodeid="rmk_' + nodeid + '" title="' + remarkInput.value + '"></remark>');
			var selectedNode = $('.selected'); //选中的节点	
			console.log(typeof(selectedNode));
			var mindMarkBox = selectedNode.children('.mindMarkBox');
			mindMarkBox.prepend(addRemarkNode);
			mindMarkBox.css('height', '20px');
		}
		remarkBox.style.display = 'none';
		thisNodeData.data.remarkText = remarkInput.value;
		//jm.select_node(selected_node); //选中当前节点			
		var operatons = {};
		operatons['action']='addremark';
		operatons['remarkid']=selected_node.id;
		operatons['remarkcontent']=remarkInput.value;
		ws.send(JSON.stringify(operatons));
	}
}

//删除备注
function delRemark() {
	var selected_node = jm.get_selected_node(); //选中的节点
	// 判断是否有选中节点
	if(!selected_node) {
		alert('请选择一个节点');
		return;
	}

	var nodeid = selected_node.id; //选中节点的id	
	var fmkNode = $('filemark[nodeid="fmk_' + nodeid + '"]'); //相同节点的文件
	fmkNode.remove(); //移除当前文件节点
	$('remark[nodeid="rmk_' + nodeid + '"]').remove(); //移除当前备注节点
	thisNodeData.data.remarkText = null; //置空当前备注数据

	$('.selected .mindMarkBox').css('height', '0');
	
	var operatons = {};
	operatons['action']='delremark';
	operatons['remarkid']=selected_node.id;
	ws.send(JSON.stringify(operatons));

}

//获取数据
function getData() {
	// 括号内为数据格式
	var hj = jm.get_data('node_array');
	console.log(hj["data"]);
	console.log(deleted);
		$.ajax({
            url:"/bebrain/savemind/",
            type:"POST",
            data:{
				data:JSON.stringify(hj),
				dele:JSON.stringify(deleted)
			},
            dataType: "json",
            success: function(data) {
                console.log(data.result);
            }
        })
}




//上传附件
function addFile() {
	var fileInput = $('#fileInput');
	fileInput.click();
	var selectedNode = $('.selected'); //选中的节点
	var nodeid = selectedNode.attr('nodeid');
	fileInput.off('change');

	fileInput.on('change', function() {
		var thisfileMark = $('fileMark[nodeid="fmk_' + nodeid + '"]'); //当前节点的附件标记

		if(thisfileMark.length > 0) {
			thisfileMark.attr('title', $(this).val());
		} else {
			var addFileNode = $('<fileMark class="fileMarkN" nodeid="fmk_' + nodeid + '" title="' + $(this).val() + '"></fileMark>');
			var mindMarkBox = selectedNode.children('.mindMarkBox');
			mindMarkBox.append(addFileNode);
			mindMarkBox.css('height', '20px');
		}

		thisNodeData.data.fileInfo = $(this).val(); //添加文件信息	
		fileInput.val(''); //重置文件输入框

	});

}

//删除附件
function delFile() {
	var selected_node = jm.get_selected_node(); //选中的节点
	// 判断是否有选中节点
	if(!selected_node) {
		alert('请选择一个节点');
		return;
	}

	var nodeid = selected_node.id; //选中节点的id	
	var rmkNode = $('remark[nodeid="rmk_' + nodeid + '"]'); //相同节点的备注
	$('filemark[nodeid="fmk_' + nodeid + '"]').remove(); //移除附件
	thisNodeData.data.fileInfo = null; //重置附件信息

	if(rmkNode.length < 1) {
		//调整备注标记父容器节点高度
		$('.selected .mindMarkBox').css('height', '0');
	}
}

//备注弹框移动
function remarkMove() {
	var clicked = "Nope."; //鼠标是否选中按住元素
	var mausx = "0"; //鼠标相对文档坐标
	var mausy = "0";
	var winx = "0"; //元素相对文档坐标
	var winy = "0";
	var difx = mausx - winx;
	var dify = mausy - winy;
	var moveBoxChild = $('.rmarkTitle');
	var moveBox = $('.remarkContent');

	$("html").mousemove(function(event) {
		mausx = event.pageX; //鼠标指针相对文档左边缘的位置
		mausy = event.pageY; //鼠标指针相对文档上边缘的位置
		winx = moveBox.offset().left; //元素距离文档左边距离
		winy = moveBox.offset().top; //元素相对文档上边距离
		if(clicked == "Nope.") {
			difx = mausx - winx;
			dify = mausy - winy;
		} else {
			var newx = event.pageX - difx - moveBox.css("marginLeft").replace('px', '');
			var newy = event.pageY - dify - moveBox.css("marginTop").replace('px', '');
			moveBox.css({
				top: newy,
				left: newx
			});
		}
	});

	moveBoxChild.mousedown(function(event) {
		clicked = "Yeah.";
	});

	$("html").mouseup(function(event) {

		clicked = "Nope.";
	});
}

//思维导图对齐方式
function alignType(aType) {
	var newMind = jm.get_data('node_array'); //获取页面数据
	$('#jsmind_container').html(''); //思维导图父容器置空
	options.mode = aType; //对齐方式,full:左右对齐，side:右对齐
	jm = new jsMind(options); //重载jsmind
	jm.show(newMind);
}

//导出数据文件到本地
var downloadFile = {
	dJson: function(data, name) {
		// 导出生成json文件
		var blob = new Blob([JSON.stringify(data)], {
			type: ""
		});
		saveAs(blob, name + ".json");
	},
	dText: function(data, name) {
		// 导出生成文本
		var rootobj = jm.get_root();
		var rootid = rootobj.id;
		var stringlist = [];
		function printList(parentId, tree, spaceStr = ''){
			tree.forEach(function (x){
				if (x["parentid"] == parentId){
					stringlist.push(spaceStr+x["topic"]);
					printList(x["id"], tree, spaceStr + '\t')
				}
			});
		}
		printList(rootid, data["data"]);
		var arraystr = stringlist.join("\n");
		var blob = new Blob([arraystr], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, name + ".txt");	
		
	},
	dYtm: function(data, name) {
		// 导出生成自定义格式
		var blob = new Blob([JSON.stringify(data)], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, name + ".ytm");
	},
	btnClick: function() {
		//保存按钮事件
		$('#downloadJson').on('click', function() {
			var mData = jm.get_data('node_array');
			var fileName = $('.root .nodeContent').text();
			downloadFile.dJson(mData, fileName);
		});

		$('#downloadTxt').on('click', function() {
			var mData = jm.get_data('node_array');
			var fileName = $('.root .nodeContent').text();
			downloadFile.dText(mData, fileName);
		});

		$('#downloadYtm').on('click', function() {
			var mData = jm.get_data('node_array');
			var fileName = $('.root .nodeContent').text();
			downloadFile.dYtm(mData, fileName);
		});
		
		//导入
		$('#importData').on('click',function(){
			$('#importInput').click();
		});
	}
}


//发送虚拟POST请求到后台
function httpPost(URL, PARAMS) {
	var temp = document.createElement("form");
	temp.action = URL;
	temp.method = "post";
	temp.target="targetIfr";
	temp.style.display = "none";

	var opt = document.createElement("textarea");
	opt.name = "virtualpost";
	opt.value = PARAMS;
	temp.appendChild(opt);

	document.body.appendChild(temp);
	temp.submit();

	return temp;
}

function downloadxmind(){
	var mData = jm.get_data('node_array');
	httpPost("/bebrain/downloadmind/", JSON.stringify(mData["data"]));
}





//数据导入
function importFn(source) {
	var file = source.files[0];
	console.log(file.name);
	var mindname = file.name;
	var houzhui = mindname.substring(mindname.lastIndexOf(".")+1);
	console.log(houzhui.toLowerCase());
	if (houzhui == "xmind")
	{
	var fd = new FormData();
	fd.append("upfile", file);
	fd.append("mindname", mindname);
	$.ajax({
		url: "/bebrain/uploadmind/",
		type: "POST",
		processData: false,
		contentType: false,
		data: fd,
		dataType: "json",
		success: function (response) {
			console.log("成功接收生成的mindarray");
			$('#jsmind_container').html('');
			jm = new jsMind(options);
			jm.show(response);
		}
	})
	}
	else
	{
	if(window.FileReader) {
		var fr = new FileReader();
		fr.onloadend = function(e) {			
			var newMind = JSON.parse(e.target.result); //获取页面数据	
			$('#jsmind_container').html(''); //思维导图父容器置空		
			jm = new jsMind(options); //重载jsmind
			jm.show(newMind);
	
		};
		fr.readAsText(file);
	}
	}
}

function chatIcon(){
	console.log("显示聊天");
	$('#chat-window').css('display', 'none');
	$('#active-window').css('display', 'block');
	$('#contacts-window').css('display', 'none');
	$('#user-window').css('display', 'none');
}

function contactsIcon(){
	console.log("显示通讯录");
	$('#chat-window').css('display', 'none');
	$('#active-window').css('display', 'none');
	$('#contacts-window').css('display', 'block');
	$('#user-window').css('display', 'none');
}

function userIcon(){
	console.log("显示我");
	$('#chat-window').css('display', 'none');
	$('#active-window').css('display', 'none');
	$('#contacts-window').css('display', 'none');
	$('#user-window').css('display', 'block');
}

function backarrowIcon(){
	console.log("返回聊天人列表");
	$('#chat-window').css('display', 'none');
	$('#active-window').css('display', 'block');
}

function enterchat(obj){
	console.log(obj.id);
	$('#chat-window').css('display', 'block');
	$('#active-window').css('display', 'none');
	$('#contacts-window').css('display', 'none');
	var ActualId = obj.id.split("-")[0];
	console.log(ActualId);
	var noticeBox=document.getElementById(ActualId+'-dia');
	if (noticeBox){
		var getSecondChild = noticeBox.children[1];
		if (getSecondChild.className = "notices"){
			getSecondChild.style.display = "none";
		}
	}
	console.log('输出ChatData');
	console.log(ChatData);
	$("#huihua").html('');
	$(".chat-with").html(ChatData[ActualId]['name']);
	divid.innerHTML = ActualId;

	if (!DialogData.hasOwnProperty(ActualId)){
		    DialogData[ActualId] = [];
		}

	if (DialogData[ActualId].length>0){
	DialogData[ActualId].forEach((DiaItem)=>{
		var li = document.createElement("li");
        var img1 = document.createElement("img");
        img1.src=ChatData[DiaItem['source']]['imgurl'];
        img1.alt="avatar";
        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        if (DiaItem['source'] == 'user'){
        	img1.className="right-img";
	        div1.className="message-data-right";
	        div2.className="my-message";
        }
        else {
        	img1.className="left-img";
	        div1.className="message-data-left";
	        div2.className="other-message";
        }
        if (ActualId=='crowdall' && DiaItem['source'] != 'user'){
	        var span1 = document.createElement("span");
	        span1.className="message-data-name";
	        var SourceId = DiaItem['source'];
	        span1.innerHTML=ChatData[SourceId]['name']+" ";
	        div1.appendChild(span1); 
        }
        console.log(DiaItem);
        var span2 = document.createElement("span");
        var br1 = document.createElement("br");
        span2.className="message-data-time";
        span2.innerHTML=DiaItem['message_time'].slice(11,16);
        div1.appendChild(span2);
        div1.appendChild(br1);

        li.appendChild(img1);
        div2.innerHTML=DiaItem['message_text'];
        div1.appendChild(div2);
        li.appendChild(div1);
        $("#huihua").append(li);
	});
	}

	var huadong = document.getElementById('hist');
    huadong.scrollTop = huadong.scrollHeight;

}


var cBox=document.getElementById('chat-box'); 
var rLine = document.getElementById('line-right');
var mBox = document.getElementById('mind-box');
var rspan = document.getElementById('span-right');
var ChatControl = document.getElementById('chat-control');
var bChat='';
var obody = document.getElementById('body');
var dxChat;
var dwChat;//存储默认的div的宽度。
var disrightChat=cBox.offsetLeft+cBox.offsetWidth;//存储默认div右边距离屏幕左边的距离。
function chatdown(ev){  
	var iEvent=ev||event;  
	dxChat=iEvent.clientX;//当你第一次单击的时候，存储x轴的坐标。   
	dwChat=cBox.offsetWidth;  
	if(iEvent.clientX<cBox.offsetLeft+10){
		bChat='right';  
	}
	obody.addEventListener('mousemove', chatmove)
	return false; 
	}; 
	
function chatmove(ev){  
	var iEvent=ev||event;
	if(bChat=='right'){  
		cBox.style.width=dwChat-(iEvent.clientX-dxChat)+'px';//iEvent.clientX-dx表示第二次鼠标的X坐标减去第一次鼠标的X坐标，得到绿色移动的距离（为负数），再加上原本的div宽度，就得到新的宽度。   
		ChatControl.style.width = cBox.offsetWidth+'px';
		
		cBox.style.left=disrightChat-cBox.offsetWidth+'px';//disright表示盒子右边框距离左边的距离，disright-当前的盒子宽度，就是当前盒子距离左边的距离  
		rLine.style.left = disrightChat-cBox.offsetWidth+'px';
		mBox.style.right = cBox.offsetWidth+'px';
		rspan.style.right = mBox.style.right;
		$('.icon-control').css('width', 80*cBox.offsetWidth*4/disrightChat+'px');
		//disright表示盒子右边框距离左边的距
		if(cBox.offsetWidth<=250){  
			cBox.style.width='250px';  
			cBox.style.left=disrightChat-cBox.offsetWidth+'px';//防止抖动  
			
			rLine.style.left = disrightChat-cBox.offsetWidth+'px';
			mBox.style.right = cBox.offsetWidth+'px';
			rspan.style.right = mBox.style.right;
		}
		else if(cBox.offsetWidth>=1000){
			cBox.style.width='1000px';
			cBox.style.left=disrightChat-cBox.offsetWidth+'px';//防止抖动 
			rLine.style.left = disrightChat-cBox.offsetWidth+'px';
			mBox.style.right = cBox.offsetWidth+'px';
			rspan.style.right = mBox.style.right;
		}
	}  
	  
};  
function chatup(){ 
	console.log(cBox.offsetWidth);
	obody.removeEventListener('mousemove', chatmove) 
};  


obody.addEventListener('mouseup', chatup)
rLine.addEventListener('mousedown', chatdown)
var aChat = 1;
rspan.onclick = function() {
	//var oBox=document.getElementById('box'); 
	var disrightChat=cBox.offsetLeft+cBox.offsetWidth;
	if(aChat%2 == 0) {
		aChat++;
		console.log('opened');
		cBox.style.display = "block";
		rLine.style.display = "block";
		//console.log(document.body.offsetWidth);
		rLine.style.left = cBox.offsetLeft + 'px';
		mBox.style.right = cBox.offsetWidth + 'px';
		rspan.style.right = mBox.style.right;
		rspan.innerHTML = "关闭聊天";
		//oBox.style.width=oBox.style.width+40;
		
		
	} else {
		console.log('closed');
		aChat++;
		mBox.style.right = 0 + 'px';
		rspan.style.right = mBox.style.right;
		rLine.style.display = "none";
		cBox.style.display = "none";
		rspan.innerHTML = "打开聊天";
		//oBox.style.width=oBox.style.width-40;

	}
}


var aBox=document.getElementById('article-editor'); 
var lLine = document.getElementById('line-left');
var lspan = document.getElementById('span-left');
var bArticle='';
var dxArticle;
var dwArticle;//存储默认的div的宽度。
var disrightArticle=aBox.offsetLeft+aBox.offsetWidth;//存储默认div右边距离屏幕左边的距离。
function articledown(ev){  
	var iEvent=ev||event;  
	dxArticle=iEvent.clientX;//当你第一次单击的时候，存储x轴的坐标。   
	dwArticle=aBox.offsetWidth;  
	console.log(disrightArticle);
	if(iEvent.clientX<disrightArticle+10){
		bArticle='left';  
	}
	obody.addEventListener('mousemove', articlemove)
	return false; 
	}; 
	
function articlemove(ev){  
	var iEvent=ev||event;
	if(bArticle=='left'){  
		aBox.style.width=dwArticle+(iEvent.clientX-dxArticle)+'px';//iEvent.clientX-dx表示第二次鼠标的X坐标减去第一次鼠标的X坐标，得到绿色移动的距离（为负数），再加上原本的div宽度，就得到新的宽度。   
		aBox.style.right=aBox.offsetWidth+'px';//当前盒子右边距等于盒子宽度  
		lLine.style.left = aBox.offsetWidth+'px';
		mBox.style.left = aBox.offsetWidth+'px';
		lspan.style.left = aBox.offsetWidth+'px';
		//disright表示盒子右边框距离左边的距
		if(aBox.offsetWidth<=200){  
			aBox.style.width='200px';  
			aBox.style.right='200px';
			lLine.style.left = aBox.offsetWidth+'px';
			mBox.style.left = aBox.offsetWidth+'px';
			lspan.style.left = aBox.offsetWidth+'px';
		}
		else if (aBox.offsetWidth>=1000){
			aBox.style.width='1000px'; 
			aBox.style.right='1000px';
			lLine.style.left = aBox.offsetWidth+'px';
			mBox.style.left = aBox.offsetWidth+'px';
			lspan.style.left = aBox.offsetWidth+'px';
		}
	}  
	  
};  
function articleup(){ 
	obody.removeEventListener('mousemove', articlemove) 
};  


obody.addEventListener('mouseup', articleup)
lLine.addEventListener('mousedown', articledown)
var aArticle = 1;
lspan.onclick = function() {
	//var oBox=document.getElementById('box'); 
	var disrightArticle=aBox.offsetLeft+aBox.offsetWidth;
	if(aArticle%2 == 0) {
		aArticle++;
		console.log('opened');
		aBox.style.display = "block";
		lLine.style.display = "block";
		//console.log(document.body.offsetWidth);
		lLine.style.left = aBox.offsetRight + 'px';
		mBox.style.left = aBox.offsetWidth + 'px';
		lspan.style.left = mBox.style.left;
		lspan.innerHTML = "关闭文章";
		//oBox.style.width=oBox.style.width+40;
		
		
	} else {
		console.log('closed');
		aArticle++;
		mBox.style.left = 0 + 'px';
		lspan.style.left = mBox.style.left;
		lLine.style.display = "none";
		aBox.style.display = "none";
		lspan.innerHTML = "打开文章";
		//oBox.style.width=oBox.style.width-40;

	}
}

var exportarticle = document.getElementById('article-export');
var textbox = document.getElementById('article-text');
exportarticle.onclick = function(){
	console.log(textbox.innerText);
}

var deletebutton = document.getElementById('delete-cell');
deletebutton.onclick = function(){
	var boxlen=$("#article-text").children("div").length;

	if (boxlen>1){textbox.removeChild(selecteddiv);}
}

var savebotton = document.getElementById('article-save');
savebotton.onclick = function(){
	console.log(textbox.innerHTML);
}



var outchatBtn=document.getElementById('outchat'); 
outchatBtn.onclick = function (){
	var exportlist = [];
	exportlist.push(ChatData['user']['name']+" "+ChatData['user']['details']);
	exportlist.push('');
	exportlist.push('');

	for (var ChatItem in DialogData){
		exportlist.push('------------------------------');
		exportlist.push(ChatData[ChatItem]['name']+" "+ChatData[ChatItem]['details']);
		if (DialogData[ChatItem].length>0){
		DialogData[ChatItem].forEach((DiaItem)=>{
			exportlist.push(ChatData[DiaItem['source']]['name']+'-->'+DiaItem['message_text']+'-->'+DiaItem['message_time']);
		});
		}

	}
	var exportstr = exportlist.join("\n");
	var blob = new Blob([exportstr], {
		type: "text/plain;charset=utf-8"
	});
	saveAs(blob, ChatData['user']['name'] + "的聊天记录.txt");
}

function LoadChatData(){
	
	$('.contacts-list').html('');

	for (var contactsiditem in ChatData){
		if (contactsiditem != 'user' && contactsiditem != 'crowdall'){
			var li = document.createElement("li");
			li.className="contacts-item";
			li.id = contactsiditem+"-cha";
			li.setAttribute("onclick","enterchat(this)");
			var img = document.createElement("img");
			img.src=ChatData[contactsiditem]['imgurl'];
			img.className="contacts-img";
			img.alt="avatar";
			var div1 = document.createElement("div");
			var div2 = document.createElement("div");
			var div3 = document.createElement("div");
			div1.className="contacts-person";
			div2.className="contacts-name";
			div3.className="contacts-info";
			div2.innerHTML=ChatData[contactsiditem]['name'];
			div3.innerHTML=ChatData[contactsiditem]['details'];
			li.appendChild(img);
			div1.appendChild(div2);
			div1.appendChild(div3);
			li.appendChild(div1);
			$('.contacts-list').append(li);
		}
	};

	$('.active-list').html('');

	var li = document.createElement("li");
	li.className="active-item";
	li.id = 'crowdall-dia';
	li.setAttribute("onclick","enterchat(this)");
	var img = document.createElement("img");
	img.src=ChatData['crowdall']['imgurl'];
	img.className="active-img";
	img.alt="avatar";
	var div0 = document.createElement("div");
	var div1 = document.createElement("div");
	var div2 = document.createElement("div");
	var div3 = document.createElement("div");
	div0.className="notices";
	div1.className="active-person";
	div2.className="active-name";
	div3.className="active-info";
	div2.innerHTML=ChatData['crowdall']['name'];
	if (DialogData['crowdall'].length>0){
		div3.innerHTML=DialogData['crowdall'].slice(-1)[0]['message_text'];
	}
	li.appendChild(img);
	div1.appendChild(div2);
	div1.appendChild(div3);
	li.appendChild(div0);
	li.appendChild(div1);
	$('.active-list').append(li);


	for (var contactsiditem in DialogData){
		if (contactsiditem != 'crowdall'){
			var li = document.createElement("li");
			li.className="active-item";
			li.id = contactsiditem+"-dia";
			li.setAttribute("onclick","enterchat(this)");
			var img = document.createElement("img");
			img.src=ChatData[contactsiditem]['imgurl'];
			img.className="active-img";
			img.alt="avatar";
			var div0 = document.createElement("div");
			var div1 = document.createElement("div");
			var div2 = document.createElement("div");
			var div3 = document.createElement("div");
			div0.className="notices";
			div1.className="active-person";
			div2.className="active-name";
			div3.className="active-info";
			div2.innerHTML=ChatData[contactsiditem]['name'];
			console.log(DialogData[contactsiditem].slice(-1)[0]);
			div3.innerHTML=DialogData[contactsiditem].slice(-1)[0]['message_text'];
			li.appendChild(img);
			div1.appendChild(div2);
			div1.appendChild(div3);
			li.appendChild(div0);
			li.appendChild(div1);
			$('.active-list').append(li);
		}
	};







}