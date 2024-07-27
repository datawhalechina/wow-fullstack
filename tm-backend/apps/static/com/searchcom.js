var searchForm = {
	// 搜索表单
	props: ['selectwords'],
	delimiters: ['{[', ']}'],
	template: `
    <div style="text-align: center;">
		<div class="row" v-for="(item,index) in querylist" style="margin:0 auto;padding-top:5px;text-align: center;">
			<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
			<select id="fclass" class="col-md-3 offset-md-2 form-control" v-model="item[0]">
				<option value="author_name">作者</option>
				<option value="title">标题</option>
				<option value="fulltext">全文</option>
				<option value="title/fulltext">标题/全文</option>
			</select>
			<span>&nbsp;&nbsp;</span>
			<input v-model="item[1]" class="col-md-5 form-control" @input="changewords()" placeholder="可以用and和or，不要用括号" type="text">
			<span v-if="index<querylist.length-1">&nbsp;&nbsp;<label class="btn btn-default">AND</label></span>
			<span v-if="index>0">&nbsp;&nbsp;<button class="btn btn-default" @click="deletewords(index)">删除</button></span>
		</div>
		<button class="btn btn-primary" style="margin-top:10px;" @click="addwords()">+增加字段</button>
		<span>&nbsp;&nbsp;</span>
		<button class="btn btn-primary" style="margin-top:10px;" @click="query()" :disabled="disabled">开始检索</button>
		<br/><br/>
	</div>`,
    data() {
        return {
			querylist:[['','']],
			disabled:true,
			
        }
    },
	methods: {
		addwords (){
			this.querylist.push(['','']);
			this.disabled = true;
		},
		deletewords (i){
			this.querylist.splice(i,1);
			this.disabled = false;
			this.querylist.forEach(el => {
				str1 = el[0];
				str2 = el[1].replace(/\s*/g,"");
				if(str1.length==0 | str2.length==0){
					this.disabled = true;
				}
			});
		},
		changewords (){
			this.disabled = false;
			this.querylist.forEach(el => {
				str1 = el[0];
				str2 = el[1].replace(/\s*/g,"");
				if(str1.length==0 | str2.length==0){
					this.disabled = true;
				}
			});
		},
		query (){
			console.log(this.querylist);
			let that = this;
			$.ajax({
				url:"/v1/tw/searchbiwen/",
				type:"POST",
				data:{
					querywords:JSON.stringify(this.querylist)
				},
				dataType: "json",
				success: function(response) {
					that.pushdata(response);
				}
			})
		},
		pushdata (rsplist){
			this.$emit("pushquery", rsplist);
		}
	   
	}
}