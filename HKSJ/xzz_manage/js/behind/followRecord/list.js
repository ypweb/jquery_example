$(function(){
		 tb = $('#div_table03').table({
			'class':'table1',	
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		events:{loaded:function(){ // loaded事件,当数据加载成功后触发,这里更新的是分页信息
		$('#spanpage',tb).empty().html('第'+tb.currentpage()+'页/共'+tb.pagecount()+'页  共'+tb.total+"条数据");
			if(tb.currentpage()==1){
				$('#span_first',tb).addClass('First');
				$('#span_prev',tb).addClass('First');
			}else{
				$('#span_first',tb).removeClass('First');
				$('#span_prev',tb).removeClass('First');
			}
			if(tb.currentpage()==tb.pagecount()){
				$('#span_first',tb).addClass('Last');
				$('#span_prev',tb).addClass('First');
			}else{
				$('#span_first',tb).removeClass('Last');
				$('#span_prev',tb).removeClass('First');
			}
			initTableLimit();
		}},
		rm:{evenclass:'rowEven',oddclass:'rowOdd',headclass:'cssth'}, //evenclass指定奇数行样式,oddclass指定偶数行样式,headclass指定表格头样式
		cm:[
 
					
					/*{ 	dataindex:'url', 	// 显示数据在行中的属性
					 	headtext:'导图',
					 	render:function(i,j,c,r){
					 		 return "<img src="+c+" style='width: 50px; height: 50px'/>";
						 }
					},*/
					{ 	dataindex:'userName', // 显示数据在行中的属性
					 	headtext:'作者' 
					},
					{ 	dataindex:'praisesSum', // 显示数据在行中的属性
					 	headtext:'点赞总数'
					} 
					,{ 	dataindex:'commentSum', // 显示数据在行中的属性
					 	headtext:'评论总数'
					}   
					,{ 	dataindex:'isPass', // 显示数据在行中的属性
					 	headtext:'审核状态',
					 	render:function(i,j,c,r){
					 		if(c == "1"){
					 			return "未审核";
					 		}
					 		if(c == "2"){
					 			return "审核通过";
					 		}
					 		if(c == "3"){
					 			return '<font style="color: red">审核不通过</ront>';
					 		} 
						 }
					} 
					,{ 	dataindex:'isLock', // 显示数据在行中的属性
					 	headtext:'锁定状态',
					 	render:function(i,j,c,r){
					 		 return '0' == c ? '未锁定':'<font style="color: red">已锁定</ront>';
						 }
					}
					
					,{ 	dataindex:'createTime', // 显示数据在行中的属性
					 	headtext:'创建时间',
					 	render : function(i, j, c, r) {
							return getFormatDate(c);
						}
					}
					,{ 	dataindex:'status', // 显示数据在行中的属性
					 	headtext:'上架状态',
					 	render:function(i,j,c,r){
							 return '0' == c ? '已上架':'<font style="color: red">已下架</ront>';
						 }
					}
					,{
					 	dataindex:'status',
					 	headtext:'操作',render:function(i,j,c,r){
					 		 var isDisabled= c =="1"?"上架":"下架";
					 		 var disabledVal= c =="1"?"0":"1";
					 		 return [ 
									$.jsonToControl(
											 {tag:'a', style:'cursor: pointer',child:{tag:'span',child:"查看"},events:{click:function(){
												  window.location.href="/xzzBehind/followRecord/detail.do?id="+r.id; 
									 return false;}}}) 
					 		         ,
									$.jsonToControl(
									 {tag:'a', style:'cursor: pointer',child:{tag:'span',child:isDisabled},events:{click:function(){
											 $.messager.confirm("确认","确定要"+isDisabled+"该随记？",function(ha){
												 if(ha)
												 {
													var status;
													var id = r.id;
													if(r.status == "1"){
														status = "0";
													}else{
														status = "1";
													}   
													console.log(r); 
													$.post('followRecord/updataStatus.do',{id:id,status:status},function(result){
													 		if(result == 'success')
													 		{
													 			tb.load();
													 			$.messager.alert("提示",isDisabled+"成功","info");
													 		}
													 		else
													 			$.messager.alert("提示",isDisabled+"失败","info");
													 	}) 
												 }
											 });
											
										 return false;}}}) 
							] ;
						}
					}
			]
			,
			url:'followRecord/listAll.do' ,
			autoload:true,
			total:'totalCount',
			root:'items'
			,
			footbar:{
					tag:'div','class':'pageBox pre',child:[//{tag:'a','class':'excelDoload pab',title:'导出Excel',child:'Excel'},
				     {tag:'div','class':'pages',child:[{tag:'span',child:'第1页/共0页',id:'spanpage'},
				             {tag:'span','class':'number',child:[{tag:'span',id:'span_first','class':'First Page',child:' 首页 ',
				            	 			 events:{click:function(){
				                                tb.firstpage();
         										}}},
                                             {tag:'span',id:'span_prev','class':'Prev  Page',child:'上页',events:{click:function(){
                                           	    tb.prevpage();
                                             }}},
                                             {tag:'span',id:'span_next','class':'First Page',child:' 下页 ',events:{click:function(){
                                           	    tb.nextpage();
                                             }}},
                                             {tag:'span',id:'span_last','class':'First Page',child:'尾页 ',events:{click:function(){
                                           	    tb.lastpage();
                                             }}}]},
                                             {tag:'input',type:'text',title:'请输入正确页数','class':'itext',id:'pageInput2'},
                                             {tag:'span','class':'numAll',id:'spanpagecount',child:'页'},
                                             {tag:'a','class':'ibutton',child:'跳转 ',events:{click:function(){
                                           	  var pn = tb.pagecount();
                                           	  if(isNaN($('#pageInput2').val()) || pn < $('#pageInput2').val()){
                                           		   $.messager.alert("提示",'输入错误,最大只能输入'+pn,"info");
                                           		   $('#pageInput2').val("");
                                           		  return;
                                           	  }
                                           	  tb.gopage($('#pageInput2').val()); 
                                             }}},
                                             '每页',
                                             {tag:'select',child:[{tag:'option',value:'10',child:'10'},
                                                                  {tag:'option',value:'20',child:'20'},
                                                                  {tag:'option',value:'30',child:'30'},
                                                                  {tag:'option',value:'40',child:'40'}],
                                              events:{change:function(e){
                                           	  tb.load({start:0,limit:$(e.target).val()});
                                              }}},'条'
                                              ]}
								]}
		});
	});
	
	//跳往添加
	function toAdd()
	{	
		window.frames["windowIf"].document.body.innerHTML = "";
		document.getElementById("windowIf").style.display="";
		$("#windowIf").attr("src","toAddAdmin.do");
		$("#windowDiv").window({title : '新增随记',width:400,height:350}).window('open');
	}
	
	//查询
	function query()
	{	
		tb.load({ 
			start :0, 
			userName : $("#userName").val(),
			isPass :$("#isPass").val(),
			status :$("#status").val(),
			isLock :$("#isLock").val(),
		});
	}