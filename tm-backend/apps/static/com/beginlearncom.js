var Quiz = {
	props: ['quesdata','username'],
	delimiters: ['{[', ']}'],
	template: `
    <div>
	<div class="items" v-for="(item,index) in quesdata">
        <h4 style="margin-bottom: 10px;">{[index+1]}. {[item.ques_title]}</h4>
        <span>{[item.ques_desc]}</span>
		<a v-if="username=='黎伟'" :href="'/guanguan/editques/'+item.quesid" target="_blank">编辑</a>
		<a v-if="item.reviewed != 1 && username=='黎伟'" :href="'/guanguan/beginreques/'+item.quesid" target="_blank">审核</a><br />
        <p v-if="item.descpic_url"><img style="max-width: 100%;height:auto;" :src="'/guanguan/mystatic/images/quespic/'+item.descpic_url" /></p>
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
	<div style="text-align: center;margin-top:15px;">
	<button class="btn rightbtn" v-show="!shownewtimu" @click="newtimu()">出个题</button>
	<a v-show="!shownewtimu" href="/v1/rw/newtask/" target="_blank"><button class="btn rightbtn">提个问</button></a>
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
                <button style="margin: 0 auto;" class="btn rightbtn"  @click="additems()">+增加条目</button>
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
		console.log(this.biwenid);
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
						console.log("有文章");
						console.log(response.varticle);
					} else {
						document.getElementById('unfold').style.display = 'none';
						document.getElementById('wrap').style.display = 'none';
						console.log("没文章，隐藏吧");
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
			document.getElementById('unfold').style.display = 'none';
			document.getElementById('biwenwrap').style.display = 'none';
			$("#wrap").css("height","0px")
			console.log(newValue);
			console.log(this.biwenid);
		  }
		},
	}
}