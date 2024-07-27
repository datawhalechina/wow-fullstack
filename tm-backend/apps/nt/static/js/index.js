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

var mind = null; //初始数据
var jm = null; //思维图对象
var thisNodeData = null; //当前节点数据
//var newmarksId = []; //新增的备注或附件标记

$(document).ready(function() {
	mind = testData;
	jm = new jsMind(options);
	jm.show(mind);
	rightMenuFn(); //鼠标右键事件
	remarkMove(); //备注弹框移动
	downloadFile.btnClick(); //导出数据文件到本地
})






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
			addbrother: 13, // <Enter>
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
				jm.remove_node(selected_node); //删除选中的节点
			}
		} else {
			jm.remove_node(selected_node); //删除选中的节点
		}
	}

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
	var remarkNode = $('remark[nodeid="rmk_' + nodeid + '"]'); //当前备注节点
	var selectedNode = $('.selected'); //当前选中节点	

	jm.select_clear(); //清除节点选中
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
		jm.select_node(selected_node); //选中节点
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
			var mindMarkBox = selectedNode.children('.mindMarkBox');
			mindMarkBox.prepend(addRemarkNode);
			mindMarkBox.css('height', '20px');
		}
		remarkBox.style.display = 'none';
		thisNodeData.data.remarkText = remarkInput.value;
		jm.select_node(selected_node); //选中当前节点			
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

	$('remark[nodeid="rmk_' + nodeid + '"]').remove(); //移除当前备注节点
	thisNodeData.data.remarkText = null; //置空当前备注数据

	if(fmkNode.length < 1) {
		//调整备注标记父容器节点高度
		$('.selected .mindMarkBox').css('height', '0');
	}

}

//获取数据
function getData() {
	// 括号内为数据格式
	var hj = jm.get_data('node_array');
	console.log(hj["data"]);
		$.ajax({
            url:"/bebrain/savemind/",
            type:"POST",
            data:{
				data:JSON.stringify(hj)
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
		var blob = new Blob([JSON.stringify(data)], {
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
	httpPost("/nt/downloadmind/", JSON.stringify(mData["data"]));
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
		url: "/nt/uploadmind/",
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



function zoomIn() {
	jm.view.zoomIn();
}

function zoomOut() {
	jm.view.zoomOut();
}
