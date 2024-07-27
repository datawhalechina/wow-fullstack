var selectCas = {
	delimiters: ['{[', ']}'],
	template: `
    <div class="row" style="margin-top:10px;">
		<div class="col-md-2">分类：</div> 
		<select id="fclass" class="col-md-2 form-control" v-model="fclassid" @change="changef()" >
            <option value=0>--一级分类--</option>
        </select>
        <span>&nbsp;</span>
        <select id="sclass" class="col-md-2 form-control" v-model="sclassid" @change="changes()">
            <option value=0>--二级分类--</option>
        </select>
		<span>&nbsp;</span>
        <select id="tclass" class="col-md-2 form-control" v-model="tclassid" @change="changet()">
            <option value=0>--三级分类--</option>
        </select>
		<div v-show="nowid==-1" style="margin-top:20px;" class="col-md-8 offset-md-2">
			新增{[nowclass]}:
			<input v-model="newclass"></input>
			<button class="btn rightbtn" @click="addclass">确定</button>
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
		//console.log([this.fclasstext,this.sclasstext,this.tclasstext]);
	},
	methods: {
		initclass: function() {
			$.ajax({
				url:"/v1/am/fetchclass/",
				type:"POST",
				data:{'par_id':0},
				dataType: "json",
				success: function(response) {
					response.push(["其他",-1]);
					document.getElementById('fclass').length = response.length+1;
					console.log("开始初始化");
					for(var i = 0;i<response.length;i++)
						{
							var text = response[i];
							document.getElementById('fclass').options[i+1].text = text[0];
							document.getElementById('fclass').options[i+1].value =text[1];
							
						}
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
			this.nowid = this.tclassid;
			this.nowclass = "三级分类";
			this.pushrst();
			
        },
		pushrst: function() {
			var pushdata = [this.nowid,this.nowclass,this.fclasstext,this.sclasstext,this.tclasstext];
			this.$emit("pushclass", pushdata);
		},
		addclass: function() {
			var classdict = {
				'fclasstext':this.fclasstext,
				'sclasstext':this.sclasstext,
				'nowclass':this.nowclass,
				'nowtitle':this.newclass
			}
			//$.ajax({
			//	url:"/verwaltung/addclass/",
			//	type:"POST",
			//	data:classdict,
			//	dataType: "json",
			//	success: function(response) {
			//		console.log("已新增");
			//	}
			//})
			
			
			this.nowid = -2;
			if (this.nowclass == "一级分类"){
				this.fclasstext = this.newclass;
				var obj = document.getElementById('fclass');
				//obj.options[this.findex].value = this.nowid;
				obj.options[this.findex].text = this.newclass;
				console.log("改变一级");
			} else if (this.nowclass == "二级分类"){
				this.sclasstext = this.newclass;
				var obj = document.getElementById('sclass');
				//obj.options[this.sindex].value = this.nowid;
				obj.options[this.sindex].text = this.newclass;
				console.log("改变二级");
			} else if (this.nowclass == "三级分类"){
				this.tclasstext = this.newclass;
				var obj = document.getElementById('tclass');
				//obj.options[this.tindex].value = this.nowid;
				// 应当只改text不要改value,因为如果改value的话，会变成空白。
				obj.options[this.tindex].text = this.newclass;
				
				console.log("改变三级");
			}
			this.pushrst();
		}
	}
}


var mulSelect = {
	props: ['clsid'],
	delimiters: ['{[', ']}'],
	template: `
    <div class="selectInput col-md-8">
	    <div class="title">
    		<input class="form-control" type="text" placeholder="请选择.." v-model="selectCon" @click.stop="liShow" />
        	<i class="fa fa-angle-down" @click.stop="liShow"></i>
    	</div>
		<i v-show="lida.length>0" @click="addkeywords" class="fa fa-plus-circle" title="新增关键词" style="font-size:20px;color:#870F11"></i>
		<div v-show="shownew" style="margin-top:20px;" class="col-md-8 offset-md-2">
			新增关键词:
			<input v-model="newkey"></input>
			<button class="btn rightbtn" @click="addkey">确定</button>
		</div>
	    <ul v-show="isShow" @click.stop="liShow">
	      <li v-for="item in lida" :key="item.Id">
	        <label :id="item.Id">
	          <input type="checkbox" v-model="item.Check" />
	          {[item.Name]}
	        </label>
	      </li>
	    </ul>
    </div>`,
    data() {
        return {
            checkedData: [], //选中的数据
			lida:[],
        	isShow: false, //下拉列表是否显示
        	selectCon: "", //选中的内容
			newkey:"",
			shownew:false
        }
    },
	mounted: function(){
		let that = this;
		
	    //点击页面空白处隐藏下拉列表
	    document.addEventListener("click", function() {
	      that.isShow = false;
	    });
	},
	methods: {
		//控制下拉列表的显示隐藏
	    liShow() {
	        this.isShow = true;
	    },
		addkeywords() {
			this.shownew = !this.shownew;
		},
	    ppp(){
	    	this.$emit("pushd", this.selectCon);
	    },
		fetchkeywords(node_id){
			let that = this;
			$.ajax({
				url:"/v1/am/fetchkeywords/",
				type:"POST",
				data:{'node_id':node_id},
				dataType: "json",
				success: function(response) {
					that.lida = [];
					var clslist=[];
					//console.log(response);
					if (response){
						clslist = response.split('，');
					}
					
					for(var i = 0;i<clslist.length;i++)
					{
						var keydict = {
							Id: i,
							Name: clslist[i],
							Check: false
						}
						that.lida.push(keydict);
					}
					//console.log(that.trydata);
					//console.log(tmplist);
				}
			})
		},
		addkey: function() {
			var keyd = {
				'node_id':this.clsid,
				'word':this.newkey
			}
			$.ajax({
				url:"/v1/am/addkeywords/",
				type:"POST",
				data:keyd,
				dataType: "json",
				success: function(response) {
					console.log("已新增");
				}
			})
			
			var keydict = {
				Id: this.lida.length,
				Name: this.newkey,
				Check: true
			}
			this.lida.push(keydict);
			this.ppp();
			this.shownew = false;
			this.newkey = "";
		}
	   
	},
	watch: {
	    lida: {
	      handler(newVal, oldVal) {
	        //选中数据
	        this.checkedData = newVal.filter(function(item) {
	          return item.Check == true;
	        });
	        //在页面打印出的数据
	        this.selectCon = ""; //点击的当前项的展示
	        for (var i = 0; i < this.checkedData.length; i++) {
	          this.selectCon += this.checkedData[i].Name + "  ";
	        }
	        this.ppp();
	      },
	      deep: true
	    },
		clsid: {
			handler(newVal, oldVal) {
				if (newVal>0){
					this.fetchkeywords(newVal);
				} else {
					this.lida = [];
				}
				
			}
		}
    }
}




