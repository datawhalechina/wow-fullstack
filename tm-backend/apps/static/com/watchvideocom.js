var Quiz = {
	props: ['quesdata','username'],
	delimiters: ['{[', ']}'],
	template: `
    <div>
	<div v-if="quesdata.length==0">空空如也。。。要不，您来出个题吧！</div>
	<div class="items" v-for="(item,index) in quesdata">
        <h4 style="margin-bottom: 10px;">{[index+1]}. {[item.ques_title]}</h4>
        <span>{[item.ques_desc]}</span>
		<a v-if="username=='黎伟'" :href="'/v1/tm/editques/'+item.quesid" target="_blank">编辑</a>
		<a v-if="item.reviewed != 1 && username=='黎伟'" :href="'/v1/tm/beginreques/'+item.quesid" target="_blank">审核</a><br />
        <p v-if="item.descpic_url"><img style="max-width: 100%;height:auto;" :src="'/v1/sp/spstatic/images/quespic/'+item.descpic_url" /></p>
        <form v-if="item.ques_type == '选择题'" :id="item.quesid">
            <div class="form-check">
            <label class="form-check-label">
                <input type="checkbox" v-model="item.reply" v-bind:disabled="jinyong" style="margin-right: 10px;" value="a">A: {[item.item_a]}
            </label>
            </div>
            <div class="form-check">
            <label class="form-check-label">
                <input type="checkbox" v-model="item.reply" v-bind:disabled="jinyong" style="margin-right: 10px;" value="b">B: {[item.item_b]}
            </label>
            </div>

            <div v-if="item.item_c" class="form-check">
                <label class="form-check-label">
                <input type="checkbox" v-model="item.reply" v-bind:disabled="jinyong" style="margin-right: 10px;" value="c">C: {[item.item_c]}
                </label>
            </div>

            <div v-if="item.item_d" class="form-check">
                <label class="form-check-label">
                    <input type="checkbox" v-model="item.reply" v-bind:disabled="jinyong" style="margin-right: 10px;" value="d">D: {[item.item_d]}
                </label>
            </div>
            <span>你的选择是：{[item.reply|Answer]}</span>
            <span v-if="check.length>0">
                <span style="color:green" v-if="check[index]>0">正确</span>
                <span style="color:red" v-else>错误</span>
            </span>
        </form>

        <form v-if="item.ques_type == '填空题'" :id="item.quizitemid">
            <div v-if="item.item_a" class="row">
                A:&nbsp;&nbsp;
                <input class="col-md-8 form-control" style="margin-bottom: 10px" v-model="item.reply[0]" v-bind:disabled="jinyong">
            </div>

            <div v-if="item.item_b" class="row">
                B:&nbsp;&nbsp;
                <input class="col-md-8 form-control" style="margin-bottom: 10px" v-model="item.reply[1]" v-bind:disabled="jinyong">
            </div>

            <div v-if="item.item_c" class="row">
                C:&nbsp;&nbsp;
                <input class="col-md-8 form-control" style="margin-bottom: 10px" v-model="item.reply[2]" v-bind:disabled="jinyong">
            </div>

            <div v-if="item.item_d" class="row">
                D:&nbsp;&nbsp;
                <input class="col-md-8 form-control" style="margin-bottom: 10px" v-model="item.reply[3]" v-bind:disabled="jinyong">
            </div>
            <span>你的答案是：{[reply[index]|Answer2]}</span>
            <span v-if="check.length>0">
                <span style="color:green" v-if="check[index]>0">正确</span>
                <span style="color:red" v-else>错误</span>
            </span>
        </form>

        <form v-if="item.ques_type == '判断题'" :id="item.quizitemid">
            <div class="row">
                <span class="col-md-8" style="text-align: left;">
                    <label class="form-check-label">
                    <input type="radio" value="正确" v-model="item.reply" v-bind:disabled=jinyong> 正确
                    </label>
                    <span>&nbsp;&nbsp;</span>
                    <label class="form-check-label">
                    <input type="radio" value="错误" v-model="item.reply" v-bind:disabled=jinyong> 错误
                    </label>
                </span>
            </div>
            <span v-if="check.length>0">
                <span style="color:green" v-if="check[index]>0">正确</span>
                <span style="color:red" v-else>错误</span>
            </span>
        </form>

        <form v-if="item.ques_type == '简答题'" :id="item.quizitemid">
            <div class="row">
                <textarea rows="4" class="col-md-10 form-control" placeholder="请回答" v-model="item.reply" v-bind:disabled="jinyong"></textarea>
            </div>
            <br/><br/>
            <span v-if="jinyong" style="color:blue">请等待老师阅卷</span>
        </form>
        <div v-if="score > check.length/2">
            <div v-if="item.ques_type == '选择题'">答案：{[item.answer|Answer3]}</div>
            <div v-else>答案：{[item.answer]}</div>
            <div>解释：{[item.explain]}</div>
        </div>
        <br/><br/>
    </div>
    <button  v-show="showsend && quesdata.length>0" class="btn btn-primary" @click="calperform()">提交</button>
    <span v-show="!showsend">亲爱的{[username]}，</span>
    <span v-show="!showsend">一共{[quesdata.length]}个题目，答对{[score]}个</span>
    </div>`,
    data() {
        return {
            check:[],
            score:0,
            showsend:true,
            jinyong:false
        }
    },
	mounted: function(){
		this.check=[];
		this.score=0;
		this.showsend=true;
	},
    filters:{
        Answer:function(inin){
            return inin.slice().sort().join('').toUpperCase();
        },
        Answer2:function(inin){
            return inin.slice().join(',');
        },
        Answer3:function(inin){
            return inin.slice().toUpperCase();
        },
    },
	methods: {
		calperform: function() {
            this.showsend = false;
            this.jinyong = true;
            var daan = "";
            var defen = 0;
            for(var i = 0 ; i < this.quesdata.length ; i++){
                if (this.quesdata[i].ques_type == '选择题') {
                    daan = this.quesdata[i].reply.slice().sort().join('').toLowerCase();
                } else if (this.quesdata[i].ques_type == '填空题') {
                    daan = this.quesdata[i].reply.slice().join(',');
                } else {
                    daan = this.quesdata[i].reply;
                }
                
                if (daan==this.quesdata[i].answer){
                    this.check.push(1);
                    defen = defen + 1;
                } else {
                    this.check.push(0);
                }
            }
            this.score = defen;
        },
	   
	},
	watch : {
		quesdata:function(newValue, oldValue) {
		  if (newValue != oldValue) {
			this.check = [];
			this.score = 0;
			this.showsend = true;
			this.jinyong = false;
		  }
		},
	}
}


var addQues = {
	props: ['videoid','userid'],
	delimiters: ['{[', ']}'],
	template: `
	<div style="text-align: center;">
	<button class="btn btn-primary" v-show="!shownewtimu" @click="togglequiz()">练习</button>
	<button class="btn btn-primary" v-show="!shownewtimu" @click="newtimu()">出题</button>
	<a v-show="!shownewtimu" href="/v1/rw/newtask/" target="_blank"><button class="btn btn-primary">提问</button></a>
	<div id="contes" v-show="shownewtimu">
        <div id="bar"></div>
        <div id="content" style="width:100%;height:300px;overflow-y: scroll;overflow-x: hidden;">
            <div style="text-align: center;">
                
                

                <div class="row" style="margin-top:10px">
                    <div class="col-md-2 kaozuo">题型：</div> 
                    <select class="col-md-8 form-control" v-model="ques_type">
                        <option value="选择题">选择题</option>
                        <option value="判断题">判断题</option>
                        <option value="填空题">填空题</option>
                    </select>
                </div>

                <div class="row" style="margin-top:10px">
                    <div class="col-md-2 kaozuo">标题：</div>
                    <textarea id="input" @blur="zhengli()" rows="4" class="col-md-8 form-control" v-model="timuxin"></textarea>
                </div>

                
                
                <div v-if="['填空题'].includes(ques_type) && slotsnum<5"  style="margin-top:10px">
                    <button style="margin: 0 auto;" class="btn btn-primary"  @click="addslots()">+挖个空儿</button>
                    
                    <div style="white-space: pre-line;color:red;margin: 0 auto;">{[slotswarning]}</div>
                </div>

                <div class="row" style="margin-top:10px">
                    <div class="col-md-2 kaozuo">说明：</div>
                    <textarea rows="4" class="col-md-8 form-control" v-model="timudesc"></textarea>
                </div>

                <div v-if="['选择题','填空题'].includes(ques_type)" v-for="(item,index) in itemlist" class="row" style="margin-top:10px">
                    <div class="col-md-2 kaozuo">{[String.fromCharCode(index+65)]}:</div>
                    <input v-model="item[0]" class="col-md-8 form-control" type="text"></input>
                    <span v-if="index>0"><button class="btn btn-default" @click="deleteitems(index)">删除</button></span>
                </div>
                <div v-if="['选择题','填空题'].includes(ques_type) && itemlist.length<4" class="row" style="margin-top:10px">
                <button style="margin: 0 auto;" class="btn btn-primary"  @click="additems()">+增加条目</button>
                </div>

                

                

                <div v-if="['选择题','判断题','简答题'].includes(ques_type)" class="row" style="margin-top:10px">
                    <div class="col-md-2 kaozuo">答案：</div>
                    <span v-if="ques_type=='判断题'" class="col-md-8" style="text-align: left;">
                        <input type="radio" id="right" value="正确" v-model="daan">
                        <label for="right">正确</label>
                        <span>&nbsp;&nbsp;</span>
                        <input type="radio" id="wrong" value="错误" v-model="daan">
                        <label for="wrong">错误</label>
                    </span>
                    <textarea v-if="['选择题','简答题'].includes(ques_type)" rows="4" class="col-md-8 form-control" v-model="daan"></textarea>
                </div>

                <div class="row" style="margin-top:10px">
                    <div class="col-md-2 kaozuo">解释：</div>
                    <textarea rows="4" class="col-md-8 form-control" v-model="jieshi"></textarea>
                </div>

                <br/>
                <input @click="tijiao()" type="submit" value="提交">
				<input @click="quxiao()" type="submit" value="取消">
            </div>
			<br/>
			<br/>
        </div>
    </div>
	</div>`,
	data() {
        return {
			shownewtimu: false,
            kong:true,
            timuxin:'',
            slotsnum:0,
            slotswarning:'',
            itemlist:[['']],
            timudesc:'',
			ques_type:'选择题',
            itemA:'',
            itemB:'',
            itemC:'',
            itemD:'',
            daan:'',
            jieshi:''
        }
    },
	methods: {
		zhengli : function() {
			var re = /__.?__/gi;
			var listpart = this.timuxin.split(re);
			this.slotsnum = listpart.length;
			var smallpart=listpart[0];
			for (i=1;i<listpart.length;i++){
				smallpart = smallpart + "__" + String.fromCharCode(64+i) + "__" + listpart[i];
			}
			this.timuxin = smallpart;
			this.slotswarning = "";
		},
		additems : function (){
			this.itemlist.push(['']);
			console.log(this.itemlist);
		},
		deleteitems : function (i){
			this.itemlist.splice(i,1);
		},
		addslots : function() {
			var re = /__.?__/gi;
			indexlist = [];
			while (re.test(this.timuxin)){
				indexlist.push(re.lastIndex);
				indexlist.push(re.lastIndex-1);
				indexlist.push(re.lastIndex-2);
				indexlist.push(re.lastIndex-3);
				indexlist.push(re.lastIndex-4);
				indexlist.push(re.lastIndex-5);
			}
			
			var input = document.getElementById("input");
			var cursurPosition = -1;
			indexlist.push(this.timuxin.length);
			cursurPosition = input.selectionStart;
			//console.log(cursurPosition);
			if (indexlist.includes(cursurPosition)){
				this.slotswarning = "不许在这里挖空儿！";
			}else{
				var frontpart = this.timuxin.slice(0,cursurPosition);
				var lastpart = this.timuxin.slice(cursurPosition, this.timuxin.length);
				var whole = frontpart + "____" + lastpart;
				var listpart = whole.split(re);
				this.slotsnum = listpart.length;
				var smallpart=listpart[0];
				for (i=1;i<listpart.length;i++){
					smallpart = smallpart + "__" + String.fromCharCode(64+i) + "__" + listpart[i];
				}
				this.timuxin = smallpart;
				this.slotswarning = "";
			}
			
		},
		newtimu () {
			this.shownewtimu=true;
		},
		togglequiz () {
			this.$emit("togglequiz",1);
		},
		tijiao () {
			this.shownewtimu=false;
			if(this.timuxin.length>0 && this.daan.length>0){
				this.itemA = this.itemlist[0][0];
				if (this.itemlist.length>1){
					this.itemB = this.itemlist[1][0];
				}
				if (this.itemlist.length>2){
					this.itemC = this.itemlist[2][0];
				}
				if (this.itemlist.length>3){
					this.itemD = this.itemlist[3][0];
				}

				if (this.ques_type=='填空题'){
					templ = []
					this.itemlist.forEach((it)=>{
						templ.push(it[0])
					})
					this.daan = templ.join(",");
				}
				let convobj = {
					'ques_type':this.ques_type,
					'ques_title':this.timuxin,
					'ques_desc':this.timudesc,
					'main_videoid':this.videoid,
					'item_a':this.itemA,
					'item_b':this.itemB,
					'item_c':this.itemC,
					'item_d':this.itemD,
					'answer':this.daan,
					'explain':this.jieshi,
					'reply':[],
					'reviewed':0,
					'ques_authorid':this.userid
				}
				$.ajax({
					url:"/v1/tm/addnewqu/",
					type:"POST",
					// data:{
					//     message:JSON.stringify(convobj)
					// },
					data:convobj,
					dataType: "json",
					success: function(response) {
						console.log(response.result.quesid);
						convobj.quesid = response.result.quesid;
					}
				})
				//console.log(convobj);
				
				this.$emit("pushques",convobj);
				//
				this.timuxin='';
				this.timudesc='';
				this.itemlist=[['']];
				this.itemA='';
				this.itemB='';
				this.itemC='';
				this.itemD='';
				this.daan='';
				this.jieshi='';
			}
		},
		quxiao () {
			this.shownewtimu=false;
		}
	},
}
	

var addBiwen = {
	props: ['biwenid','userid'],
	delimiters: ['{[', ']}'],
	template: `
	<div>
	<div id="wrap" style="overflow-y:hidden;">
	<div id='biwenwrap' style="display:none;">
		<span id='biwentitle' style="font-size:30px;font-weight:500;"></span><br />
		<span id='biwenauthor'></span>
		<span id='biwentime'></span>
	</div>
    <div style="width: 100%;border-width:0px;" id="preview"></div>
	</div>
	<div id="unfold" @click="removeheight()" class="foldercolor text-center" style="margin:0 auto"><i class="fa fa-angle-double-down" style="font-size:24px"></i></div>
	</div>`,
	data() {
        return {
			vtitle:'',
			author:'',
			createtime:'',
			showtitle:true,
			setheight:false,
            
        }
    },
	mounted: function(){
		this.fetchar(this.biwenid);
		document.getElementById('unfold').style.display = 'none';
		document.getElementById('biwenwrap').style.display = 'none';
	},
	methods: {
		fetchar (bid){
			$.ajax({
				url:"/v1/tw/fetcharticle/",
				type:"POST",
				data:{
					articleid:bid
				},
				dataType: "json",
				success: function(response) {
					
					if (response.varticle) {
						Vditor.preview(document.getElementById('preview'), response.varticle);
						document.getElementById('biwentitle').innerHTML = response.title;
						document.getElementById('biwenauthor').innerHTML = response.author_name;
						document.getElementById('biwentime').innerHTML = response.create_time;
						document.getElementById('biwenwrap').style.display = 'block';
						document.getElementById('unfold').style.display = 'block';
						$("#wrap").css("height","100px")
						addBiwen.setheight = true;
					}
					
				}
			})
		},
		removeheight(){
			console.log(this.setheight);
			if(this.setheight == true){
				document.getElementById('unfold').style.display = 'block';
				document.getElementById('unfold').innerHTML = '<i class="fa fa-angle-double-down" style="font-size:24px"></i>';
				this.setheight = false;
				$("#wrap").css("height","100px")
			} else{
				document.getElementById('unfold').innerHTML = '<i class="fa fa-angle-double-up" style="font-size:24px"></i>';
				this.setheight = true;
				console.log("展开");
				$("#wrap").css("height","")
			}
			
		}
	},
	watch : {
		biwenid:function(newValue, oldValue) {
		  if (parseInt(newValue) > 0) {
			  this.fetchar(newValue);
			  $("#wrap").css("height","100px");
			  this.setheight = true;
		  } else {
			Vditor.preview(document.getElementById('preview'), "");
			this.setheight = false;
			console.log(this.setheight);
		  }
		},
	}
}


var selectCas = {
	props: ['clsdata'],
	delimiters: ['{[', ']}'],
	template: `
    <div class="row" style="margin: 10px 0px !important;">
		<div class="col-md-4" style="padding-left:0px;padding-right:4px;">
		<select id="fclass" class="form-control" v-model="fclassid" @change="changef()">
            <option value=0>--一级分类--</option>
        </select>
		</div>
		
		<div class="col-md-4" style="padding-right:2px;padding-left:2px;">
        <select id="sclass" class="form-control" v-model="sclassid" @change="changes()" >
            <option value=0>--二级分类--</option>
        </select>
		</div>
		
		<div class="col-md-4" style="padding-left:4px;padding-right:0px;">
        <select id="tclass" class="form-control" v-model="tclassid" @change="changet()">
            <option value=0>--三级分类--</option>
        </select>
		</div>
    </div>`,
    data() {
        return {
            findex:0,
			sindex:0,
			tindex:0,
			nowid:0,
			nowclass:"",
			fclassid:0,
			fclasstext:"",
			sclassid:0,
			sclasstext:"",
			tclassid:0,
			tclasstext:"",
			newclass:""
        }
    },
	mounted: function(){
		this.initclass();
		this.fclasstext = this.clsdata[2];
		this.sclasstext = this.clsdata[3];
		this.tclasstext = this.clsdata[4];
		console.log([this.fclasstext,this.sclasstext,this.tclasstext]);
		//this.updateclass();
	},
	methods: {
		initclass: function() {
			let that = this;
			var fid = 0;
			var sid = 0;
			$.ajax({
				url:"/v1/am/fetchclass/",
				type:"POST",
				data:{'par_id':0},
				dataType: "json",
				success: function(response) {
					document.getElementById('fclass').length = response.length+1;
					console.log("开始初始化");
					console.log(response);
					for(var i = 0;i<response.length;i++)
						{
							var text = response[i];
							document.getElementById('fclass').options[i+1].text = text[0];
							document.getElementById('fclass').options[i+1].value =text[1];
							if (text[0]==that.fclasstext){
								fid=text[1];
								console.log(fid);
							}
							
						}
					that.set_select_checked("fclass",that.fclasstext);
					$.ajax({
						url:"/v1/am/fetchclass/",
						type:"POST",
						data:{'par_id':fid},
						dataType: "json",
						success: function(response) {
							document.getElementById('sclass').length = response.length+1;
							console.log(response);
							for(var i = 0;i<response.length;i++)
								{
									var text = response[i];
									document.getElementById('sclass').options[i+1].text = text[0];
									document.getElementById('sclass').options[i+1].value =text[1];
									if (text[0]==that.sclasstext){
										sid=text[1];
									}
									
								}
							that.set_select_checked("sclass",that.sclasstext);
							$.ajax({
								url:"/v1/am/fetchclass/",
								type:"POST",
								data:{'par_id':sid},
								dataType: "json",
								success: function(response) {
									document.getElementById('tclass').length = response.length+1;
									console.log(response);
									for(var i = 0;i<response.length;i++)
										{
											var text = response[i];
											document.getElementById('tclass').options[i+1].text = text[0];
											document.getElementById('tclass').options[i+1].value =text[1];
											if (text[0]==that.tclasstext){
												sid=text[1];
												console.log(sid);
											}
											
										}
									that.set_select_checked("tclass",that.tclasstext);
								}
							})
						}
					})
				}
			})
			
			
			
			
			
			
        },
		changef: function() {
			var obj = document.getElementById('fclass');
			this.findex = obj.selectedIndex;
			var parid = obj.options[this.findex].value;
			document.getElementById('sclass').innerHTML = '<option  value=0>--二级分类--</option>';
			document.getElementById('tclass').innerHTML = '<option  value=0>--三级分类--</option>';
			//console.log(this.sindex);
			this.sindex = 0;
			this.tindex = 0;
			this.fclasstext = "";
			this.sclasstext = "";
			this.tclasstext = "";
			if (parid!=0){
				this.fclasstext = obj.options[this.findex].text;
			}

			if (parid>0){
				this.fclasstext = obj.options[this.findex].text;
				$.ajax({
					url:"/v1/am/fetchclass/",
					type:"POST",
					data:{'par_id':parid},
					dataType: "json",
					success: function(response) {
						response.push(["其他",-1]);
						document.getElementById('sclass').length = response.length+1;
						for(var i = 0;i<response.length;i++)
							{
								var text = response[i];
								document.getElementById('sclass').options[i+1].text = text[0];
								document.getElementById('sclass').options[i+1].value =text[1];
							}
					}
				})
			}
			
			//console.log("改选分类1");
			this.nowid = this.fclassid;
			this.nowclass = "一级分类";
			this.pushrst();
			
        },
		changes: function() {
			var obj = document.getElementById('sclass');
			this.sindex = obj.selectedIndex;
			var parid = obj.options[this.sindex].value;
			document.getElementById('tclass').innerHTML = '<option  value=0>--三级分类--</option>';
			this.tindex = 0;
			this.sclasstext = "";
			this.tclasstext = "";
			if (parid!=0){
				this.sclasstext = obj.options[this.sindex].text;
			}
			if (parid>0){
				$.ajax({
					url:"/v1/am/fetchclass/",
					type:"POST",
					data:{'par_id':parid},
					dataType: "json",
					success: function(response) {
						response.push(["其他",-1]);
						document.getElementById('tclass').length = response.length+1;
						for(var i = 0;i<response.length;i++)
							{
								var text = response[i];
								document.getElementById('tclass').options[i+1].text = text[0];
								document.getElementById('tclass').options[i+1].value =text[1];
							}
					}
				})
			}
			
			//console.log("改选分类2");
			this.nowid = this.sclassid;
			this.nowclass = "二级分类";
			this.pushrst();
			
			//console.log([this.findex,this.sindex,this.tindex]);
        },
	   changet: function() {
		    var obj = document.getElementById('tclass');
			this.tindex = obj.selectedIndex;
			var parid = obj.options[this.tindex].value;
			this.tclasstext = "";
			if (parid!=0){
				this.tclasstext = obj.options[this.tindex].text;
			}
			//console.log([this.fclasstext,this.sclasstext,this.tclasstext]);
			this.nowid = this.tclassid;
			this.nowclass = "三级分类";
			this.pushrst();
			
        },
		pushrst: function() {
			var pushdata = [this.nowid,this.nowclass,this.fclasstext,this.sclasstext,this.tclasstext];
			this.$emit("pushclass", pushdata);
		},
		set_select_checked: function (selectId, checkText){  
			var select = document.getElementById(selectId);  
		 
			for (var i = 0; i < select.options.length; i++){  
				if (select.options[i].text == checkText){  
					select.options[i].selected = true;  
					console.log("当前选中的是"+select.options[i].text);
					break;  
				}  
			}  
		},
		updateclass: function() {
			
			console.log("更新"+this.fclasstext);
		}
	}
}

var updateVideolist = {
	props: ['clsdata'],
	delimiters: ['{[', ']}'],
	template: `
    <div class="selectInput">
	    <div v-for="(item,index) in videos" style="margin-bottom: 10px;">
			<div v-if="activeindex==index" @click="acti($event,index,item)" style="color:red;" class="col-md-12">
				<span>{[item.video_title]}</span>
				<br>
				<span style="margin-left:2em;font-size:14px;color:#aaa">{[item.video_author]} {[item.video_ip]} {[item.video_length]}</span>
			</div>
			<div v-else @click="acti($event,index,item)" class="col-md-12">
				<span>{[item.video_title]}</span>
				<br>
				<span style="margin-left:2em;font-size:14px;color:#aaa">{[item.video_author]} {[item.video_ip]} {[item.video_length]}</span>
			</div>
		</div>
    </div>`,
    data() {
        return {
            videos: [], //选中的数据
			activeindex:-1,
			activeid:-1,
        }
    },
	mounted: function(){
		this.fetchvideos(this.clsdata);
		this.activeid = this.clsdata[0];
	},
	methods: {
		//控制下拉列表的显示隐藏
	    acti(e,index,item){
			this.activeindex = index;
			this.activeid = item.videoid;
			this.$emit("pushd", this.activeid);
		},
		fetchvideos(clsd){
			let that = this;
			if(clsd[1]=='二级分类' || clsd[1]=='三级分类'){
				$.ajax({
					url:"/v1/sp/fetchclsvideos/",
					type:"POST",
					data:{'clsdata':JSON.stringify(clsd)},
					dataType: "json",
					success: function(response) {
						//console.log(response.result);
						//that.videos = [];
						that.videos = response.result;
						for (i=0;i<that.videos.length;i++){
							if(that.activeid==that.videos[i].videoid){
								that.activeindex=i;
							}
						}
					}
				})
			}
			
		}
	   
	},
	watch: {
		clsdata: {
			handler(newVal, oldVal) {
				if (newVal[0]>0){
					console.log("有效点击");
					this.fetchvideos(this.clsdata);
					//console.log(this.clsdata[0]);
					this.activeindex = -1;
					this.activeid = -1;
				} else {
					console.log("无效");
				}
				
			}
		}
    }
}