var favorBtn = {
	// 收藏按钮
	props: ['target_type','targetid','favored','favor_count'],
	delimiters: ['{[', ']}'],
	template: `
    <span>
		<div :id="'myModal'+targetid" class="modalfav" @click="wai($event)">
			<div :id="'smallmodal'+targetid" class="modal-contentfav" @click="neiwai($event)">
				<div class="modal-headerfav">
					<h3 style="margin:0 auto">添加{[target_type]}到收藏夹</h3>
					<span class="closefav" @click="guan">×</span>
				</div>
				<hr style="margin-bottom: 10px"/>
				<div class="modal-bodyfav">
					<div v-for="item in folderlist">
						<label style="font-size: 20px;" class="form-check-label row">
							<input style="width:20px;height:20px;margin:5px;" type="checkbox" @change="changesel"  v-model="item.selected" />
							<span style="margin-left:10px;font-weight:normal;color:black;">{[item.folder_title]}</span>
							<span style="right:10px;position:absolute;">{[item.item_num]}</span>
						</label>
					</div>
				</div>
				<div class="newfolder" @click="beginshu">
					<i v-show="shuru" class="fa fa-plus" style="font-size:24px"></i>
					<span v-show="shuru">新建收藏夹</span>
					<div v-show="!shuru">
						<input class="fname" v-model="newname"/>
						<label class="newbtn" @click="xinjian">新建</label>
					</div>
				</div>
				<hr style="margin-top: 0px"/>
				<div class="modal-footerfav">
					<button v-show="favornum>0" @click="confirm" class="btn btn-primary" style="width:170px;height:40px;margin:0 auto;">确定</button>
				</div>
			</div>
		</div>
		<label v-if="fav<1">
		<span style="cursor:pointer;" @click="tanchu(targetid)"><i class="fa fa-heart-o"></i></span>
		{[fav_count]}&nbsp;&nbsp;
		</label>
		<label v-else>
			<i class="fa fa-heart" style="color:red;"></i>
			<span> 已收藏 {[fav_count]}</span>
		</label>
	</span>`,
    data() {
        return {
            tid:0,
			fav:this.favored,
			fav_count:this.favor_count,
			yincang: true,
			shuru:true,
			newname:"",
			favornum:0,
			folderlist:[]
			
        }
    },
	mounted: function(){
		document.getElementById("myModal"+this.targetid).style.display = "none";
	},
	methods: {
		tanchu: function (tt) {
			console.log(tt);
			this.tid = tt;
			let that = this;
			$.ajax({
				url:"/v1/my/fetchfolder/",
				type:"POST",
				data:{
					userid:usrid,
					username:usrname
				},
				dataType: "json",
				success: function(response) {
					that.folderlist=response;
					document.getElementById("myModal"+that.targetid).style.display = "block";
				}
			})
			
		},
		xinjian: function(){
			let that = this;
			if (this.newname.length>1){
				$.ajax({
					url:"/v1/my/newfolder/",
					type:"POST",
					data:{
						folder_name:this.newname,
						userid:usrid,
						username:usrname
					},
					dataType: "json",
					success: function(response) {
						//console.log(response.newfid);
						fdata = {}
						fdata['folderid']=response.newfid
						fdata['folder_title']=that.newname
						fdata['item_num']=0
						fdata['selected']=false
						that.folderlist.push(fdata);
						that.newname = '';
						that.shuru = true;

					}
				})
			}
		},
		guan: function () {
			this.shuru = true;
			document.getElementById("myModal"+this.targetid).style.display = "none";
			
		},
		confirm: function () {
			let that = this;
			$.ajax({
				url:"/v1/my/addfavor/",
				type:"POST",
				data:{
					target_type:this.target_type,
					target_id:this.tid,
					folderlist:JSON.stringify(this.folderlist)
				},
				dataType: "json",
				success: function(response) {
					that.newname = '';
					that.shuru = true;

				}
			})
			
			if (this.favornum>0){
				this.updatefavor(this.favornum);
			}
			
			document.getElementById("myModal"+this.targetid).style.display = "none";
			
		},
		changesel: function(){
			this.favornum = 0;
			this.folderlist.forEach((ff)=>{
						if(ff.selected){
							this.favornum++;
						}
					})
		},
		updatefavor: function(num){
			this.fav_count += num;
			this.fav += num;
		},
		beginshu: function () {
			this.shuru = false;
		},
		wai: function (e) {
			var mod = document.getElementById("myModal"+this.targetid)
			if(e.target == mod) {
				this.shuru = true;
				document.getElementById("myModal"+this.targetid).style.display = "none";
			}
			
		},
		neiwai: function (e) {
			var mod = document.getElementById("smallmodal"+this.targetid)
			if(['modal-header','modal-body','modal-footer'].includes(e.target.className)) {
				this.shuru = true;
				
			}
			
		}
	   
	}
}


var Pagination = {
	// 分页器
	props: ['allpnum'],
	delimiters: ['{[', ']}'],
	template: `
    <div class="row" style="margin-top:30px;padding-bottom:50px;">
		<div class="row" v-if="allpnum>1" style="margin:0 auto;">
		<div :class="cpnum==1?pndis:pn" @click="hit('back')"><i class="fa fa-angle-left" style="font-size:24px" :disabled=true></i></div>
		<div :class="cpnum==1?cpn:pn" @click="hit(1)">1</div>
		<div :class="pn" @click="hit('leftlve')" v-if="allpnum>7 && cpnum>5">{[leftlve]}</div>
		<div :class="cpnum==i+shift?cpn:pn" @click="hit(i+shift)" v-show="allpnum>2" v-for="i in fornum">{[i+shift]}</div>
		<div :class="pn" @click="hit('rightlve')" v-if="allpnum>7 && allpnum-fornum-shift>1">{[rightlve]}</div>
		<div :class="cpnum==allpnum?cpn:pn" @click="hit(allpnum)">{[allpnum]}</div>
		<div :class="cpnum==allpnum?pndis:pn" @click="hit('fort')"><i class="fa fa-angle-right" style="font-size:24px" disabled="cpnum>allpnum-1"></i></div>
		</div>
	</div>`,
    data() {
        return {
			cpnum:1,
			shift:1,
			leftlve:'…',
			rightlve:'…',
			pn:'pagenum',
			pndis:'pagenumdis',
			cpn:'cpagenum'
			
        }
    },
	computed : {
		fornum:function(){
			var tmp = 5;
			if (this.allpnum<7){
				tmp = this.allpnum-2
			}
			return tmp
		}
	},
	methods: {
		hit(id) {
			if (!isNaN(id)){
				this.cpnum=id;            
			}
			else {
				if (id=="back"){
					this.cpnum = this.cpnum-1;
				}
				else if (id=="fort"){
					this.cpnum = this.cpnum+1;
				}
				else if (id=="leftlve"){
					if (this.cpnum>5){
						this.cpnum = this.cpnum-5;
					}
					else {
						this.cpnum = 1;
					}
					
				}
				else if (id=="rightlve"){
					if (this.allpnum-this.cpnum>5){
						this.cpnum = this.cpnum+5;
					}
					else {
						this.cpnum = this.allpnum;
					}
					
				}
			}

			this.shift = this.cpnum-3;
			if (this.cpnum<this.fornum+1){
				this.shift = 1;
			}
			else if (this.cpnum>this.allpnum-this.fornum-1){
				this.shift = this.allpnum-this.fornum-1;
			}
			console.log('点击了'+id);
			this.$emit("pushnum", this.cpnum);
			console.log(this.cpnum);
			console.log(this.fornum);
			console.log(this.shift);
		}
	   
	}
}