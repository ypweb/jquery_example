/*admin_member:成员设置*/
(function($,KE){
	'use strict';
	$(function(){

		var table=null/*数据展现*/;

		/*初始化数据*/
		if(public_tool.initMap.isrender){
			/*菜单调用*/
			var logininfo=public_tool.initMap.loginMap;
			public_tool.loadSideMenu(public_vars.$mainmenu,public_vars.$main_menu_wrap,{
				url:'http://120.24.226.70:8081/yttx-adminbms-api/module/menu',
				async:false,
				type:'post',
				param:{
					roleId:decodeURIComponent(logininfo.param.roleId),
					adminId:decodeURIComponent(logininfo.param.adminId),
					token:decodeURIComponent(logininfo.param.token)
				},
				datatype:'json'
			});


			/*权限调用*/
			var powermap=public_tool.getPower();


			/*dom引用和相关变量定义*/
			var $ad_article_wrap=$('#ad_article_wrap')/*表格*/,
				module_id='ad_article'/*模块id，主要用于本地存储传值*/,
				$data_wrap=$('#data_wrap')/*数据展现面板*/,
				$edit_wrap=$('#edit_wrap')/*编辑容器面板*/,
				$article_add_btn=$('#article_add_btn'),/*添加角色*/
				$edit_title=$('#edit_title')/*编辑标题*/,
				dia=dialog({
					title:'温馨提示',
					okValue:'确定',
					width:300,
					ok:function(){
						this.close();
						return false;
					},
					cancel:false
				})/*一般提示对象*/,
				dialogObj=public_tool.dialog()/*回调提示对象*/,
				$admin_page_wrap=$('#admin_page_wrap')/*分页数据*/;



			/*查询对象*/
			var $search_title=$('#search_title'),
				$search_time=$('#search_time'),
				$search_content=$('#search_content'),
				$admin_search_btn=$('#admin_search_btn'),
				$admin_search_clear=$('#admin_search_clear');



			/*表单对象*/
			var edit_form=document.getElementById('article_edit_form')/*表单dom*/,
				$article_edit_form=$(edit_form)/*编辑表单*/,
				$article_id=$('#article_id'),/*成员id*/
				$edit_cance_btn=$('#edit_cance_btn')/*编辑取消按钮*/,
				$article_title=$('#article_title'),/*标题*/
				$article_content=$('#article_content')/*内容*/,
				$article_time=$('#article_time')/*时间*/,
				$article_thumbnail=$('#article_thumbnail')/*缩略图*/,
				$article_belongscompany=$('#article_belongscompany')/*所属公司*/,
				$img_url_file=$('#img_url_file')/*缩略图文件浏览*/,
				$img_url_upload=$('#img_url_upload')/*缩略图文件上传按钮*/;


			/*编辑器调用*/
			var editor=KE.create("#article_content",{
					minHeight:'300px',
					height:'300px',
					filterMode :false,
					resizeType:1,/*改变外观大小模式*/
				  bodyClass:"ke-admin-wrap",
					items:[
						'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
					'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
					'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
					'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
					'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
					'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
					'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
					'anchor', 'link', 'unlink', '|', 'about'
			],
					syncType:""/*数据同步模式*/,
					afterBlur:function(){
						/*失去焦点的回调*/
						this.sync();
					},
					uploadJson : '地址',/*指定上传文件的服务器端程序*/
					allowFileManager : true,
					imageSizeLimit : "2MB",
			});


			/*时间对象*/
			var now=moment().format('YYYY-MM-DD'),
				start_format='',
				end_format='';


			/*列表请求配置*/
			var article_page={
					page:1,
					pageSize:10,
					total:0
				},
				article_config={
					$ad_article_wrap:$ad_article_wrap,
					$admin_page_wrap:$admin_page_wrap,
					config:{
						processing:true,/*大消耗操作时是否显示处理状态*/
						deferRender:true,/*是否延迟加载数据*/
						autoWidth:true,/*是否*/
						paging:false,
						ajax:{
							url:"http://120.24.226.70:8081/yttx-adminbms-api/article/advertisement/list",
							dataType:'JSON',
							method:'post',
							dataSrc:function ( json ) {
								var code=parseInt(json.code,10);
								if(code!==0){
									console.log(json.message);
									return null;
								}
								var result=json.result;
								/*设置分页*/
								article_page.page=result.page;
								article_page.pageSize=result.pageSize;
								article_page.total=result.count;
								/*分页调用*/
								$admin_page_wrap.pagination({
									pageSize:article_page.pageSize,
									total:article_page.total,
									pageNumber:article_page.page,
									onSelectPage:function(pageNumber,pageSize){
										/*再次查询*/
										var param=article_config.config.ajax.data;
										param.page=pageNumber;
										param.pageSize=pageSize;
										article_config.config.ajax.data=param;
										getColumnData(article_page,article_config);
									}
								});
								return result.list;
							},
							data:{
								roleId:decodeURIComponent(logininfo.param.roleId),
								adminId:decodeURIComponent(logininfo.param.adminId),
								token:decodeURIComponent(logininfo.param.token),
								page:1,
								pageSize:10
							}
						},
						info:false,
						searching:true,
						ordering:true,
						columns: [
							{"data":"title"},
							{
								"data":"content",
								"render":function(data, type, full, meta ){
									return data.toString().substring(0,10)+'...';
								}
							},
							{
								"data":"startTime"
							},
							{
								"data":"endTime"
							},
							{
								"data":"createTime"
							},
							{
								"data":"belongsCompany"
							},
							{
								"data":"id",
								"render":function(data, type, full, meta ){
									var id=parseInt(data,10),
										btns='';

									/*上架,下架*/
									if(typeof powermap[12]!=='undefined'){
										var status=parseInt(full.status,10);
										if(status===0){
											//上架
											btns+='<span data-action="up" data-id="'+id+'" data-isstate="true"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray12">\
											<i class="fa-arrow-up"></i>\
											<span>上架</span>\
											</span>\
											<span data-action="down" data-id="'+id+'" data-isstate="false"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
											<i class="fa-arrow-down"></i>\
											<span>下架</span>\
											</span>';
										}else if(status===1){
											//下架
											btns+='<span data-action="up" data-id="'+id+'" data-isstate="false"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
											<i class="fa-arrow-up"></i>\
											<span>上架</span>\
											</span>\
											<span data-action="down" data-id="'+id+'"  data-isstate="true"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray12">\
											<i class="fa-arrow-down"></i>\
											<span>下架</span>\
											</span>';
										}
									}

									/*修改*/
									if(typeof powermap[11]!=='undefined'){
										btns+='<span data-action="update" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
											<i class="fa-pencil"></i>\
											<span>修改</span>\
											</span>\
											<span data-action="delete" data-id="'+id+'"  class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
											<i class="fa-trash"></i>\
											<span>删除</span>\
											</span>';
									}
									return btns;
								}
							}
						]
					}
				};
			

			/*初始化请求*/
			getColumnData(article_page,article_config);



			/*
			* 初始化
			* */
			(function(){
				/*清空编辑器内容*/
				editor.html('');
				/*重置表单*/
				edit_form.reset();
			}());


			/*日历调用*/
			$.each([$article_time,$search_time],function(){
				var selector=this.selector;

					this.val('').daterangepicker({
						format: 'YYYY-MM-DD',
						todayBtn: true,
						endDate:end_format,
						startDate:start_format,
						separator:','
					})
			});


			/*清空查询条件*/
			$admin_search_clear.on('click',function(){
				$.each([$search_title,$search_time,$search_content],function(){
					this.val('');
				});
			})


			/*联合查询*/
			$admin_search_btn.on('click',function(){
				var data= $.extend(true,{},article_config.config.ajax.data);

				$.each([$search_title,$search_time,$search_content],function(){
					var text=this.val(),
						selector=this.selector.slice(1);

					switch (selector){
						case "search_title":
							if(text===""){
								if(typeof data['title']!=='undefined'){
										delete data['title'];
								}
							}else{
								count++;
								data['title']=text;
							}
							break;
						case "search_time":
							if(text===""){
								if(typeof data['startTime']!=='undefined'){
									delete data['startTime'];
								}
								if(typeof data['endtTime']!=='undefined'){
									delete data['endTime'];
								}
							}else{
								count++;
								var temptime=text.split(',');
								data['startTime']=temptime[0];
								data['endTime']=temptime[1];
							}
							break;
						case "search_content":
							if(text===""){
								if(typeof data['content']!=='undefined'){
									delete data['content'];
								}
							}else{
								count++;
								data['content']=text;
							}
							break;
					}
				});
				article_config.config.ajax.data= $.extend(true,{},data);
				getColumnData(article_page,article_config);
			});


			/*事件绑定*/
			/*绑定查看，修改操作*/
			$ad_article_wrap.delegate('span','click',function(e){
				e.stopPropagation();
				e.preventDefault();

				var target= e.target,
					$this,
					id,
					action,
					$tr;

				//适配对象
				if(target.className.indexOf('btn')!==-1){
					$this=$(target);
				}else{
					$this=$(target).parent();
				}
				$tr=$this.closest('tr');
				id=$this.attr('data-id');
				action=$this.attr('data-action');

				/*修改操作*/
				if(action==='update'){
					/*调整布局*/
					$data_wrap.addClass('collapsed');
					$edit_wrap.removeClass('collapsed');
					$("html,body").animate({scrollTop:300},200);
					//重置信息
					$edit_title.html('修改文章广告');

					var datas=table.row($tr).data();
					for(var i in datas) {
						switch (i) {
							case "id":
								$article_id.val(datas[i]);
								break;
							case "title":
								$article_title.val(datas[i]);
								break;
							case "content":
								$article_content.val(datas[i]);
								editor.html(datas[i]);
								break;
							case "startTime":
								start_format=datas[i];
								break;
							case "endTime":
								end_format=datas[i];
								break;
							case "thumbnail":
								$article_thumbnail.val(datas[i]);
								break;
							case "belongsCompany":
								$article_belongscompany.val(datas[i]);
								break;
						}
					}
					/*设置时间和日历控件*/
					$article_time.val(start_format+','+end_format).daterangepicker({
						format: 'YYYY-MM-DD',
						todayBtn: true,
						endDate:end_format,
						startDate:start_format,
						separator:','
					});
				}else if(action==='delete'){
					/*删除操作*/
					//没有回调则设置回调对象
					dialogObj.setFn(function(){
						var self=this;

						$.ajax({
								url:"http://120.24.226.70:8081/yttx-adminbms-api/article/advertisement/operate",
								method: 'POST',
								dataType: 'json',
								data:{
									"articleId":id,
									"adminId":decodeURIComponent(logininfo.param.adminId),
									"token":decodeURIComponent(logininfo.param.token),
									"operate":3
								}
							})
							.done(function (resp) {
								var code=parseInt(resp.code,10);
								if(code!==0){
									dia.content('<span class="g-c-bs-warning g-btips-warn">删除失败</span>').show();
									setTimeout(function () {
										dia.close();
									},2000);
									console.log(resp.message);
									return false;
								}
								getColumnData(article_page,article_config);
								//table.row($tr).remove().draw(false);
								setTimeout(function(){
									self.content('<span class="g-c-bs-success g-btips-succ">删除数据成功</span>');
								},100);
							})
							.fail(function(resp){
								console.log(resp.message);
							});
					},'article_delete');
					//确认删除
					dialogObj.dialog.content('<span class="g-c-bs-warning g-btips-warn">是否删除此数据？</span>').showModal();

				}else if(action==='up'||action==='down'){
					/*判断是否可以上下架*/
					var isstate=$this.attr('data-isstate');

					if(action==='up'){
						if(isstate==='true'){
							dia.content('<span class="g-c-bs-warning g-btips-warn">目前是已经是\"上架状态\",请选择\"下架状态\"</span>').show();
							return false;
						}
						var state=1;
						/*更改状态*/
						$this.attr({
							"data-isstate":true
						}).removeClass('g-c-gray8').addClass("g-c-gray12").next().attr({
							"data-isstate":false
						}).removeClass('g-c-gray12').addClass("g-c-gray8");
					}else if(action==='down'){
						if(isstate==='true'){
							dia.content('<span class="g-c-bs-warning g-btips-warn">目前是已经是\"下架状态\",请选择\"上架状态\"</span>').show();
							return false;
						}
						var state=2;
						/*更改状态*/
						$this.attr({
							"data-isstate":true
						}).removeClass('g-c-gray8').addClass("g-c-gray12").prev().attr({
							"data-isstate":false
						}).removeClass('g-c-gray12').addClass("g-c-gray8");
					}

					/*上架和下架*/
					$.ajax({
							url:"http://120.24.226.70:8081/yttx-adminbms-api/article/advertisement/operate",
							method: 'POST',
							dataType: 'json',
							data:{
								"articleId":id,
								"adminId":decodeURIComponent(logininfo.param.adminId),
								"token":decodeURIComponent(logininfo.param.token),
								"operate":state
							}
						})
						.done(function(resp){
							var code=parseInt(resp.code,10);
							if(code!==0){
								/*回滚状态*/
								if(action==='up'){
									/*更改状态*/
									$this.attr({
										"data-isstate":false
									}).removeClass('g-c-gray12').addClass("g-c-gray8").next().attr({
										"data-isstate":false
									}).removeClass('g-c-gray8').addClass("g-c-gray12");
								}else if(action==='down'){
									/*更改状态*/
									$this.attr({
										"data-isstate":false
									}).removeClass('g-c-gray12').addClass("g-c-gray8").prev().attr({
										"data-isstate":false
									}).removeClass('g-c-gray8').addClass("g-c-gray12");
								}
								console.log(resp.message);
								return false;
							}

						})
						.fail(function(resp){
							console.log(resp.message);
						});
				}



			});


			/*取消修改*/
			$edit_cance_btn.on('click',function(e){
				//切换显示隐藏表格和编辑区
				/*调整布局*/
				$data_wrap.removeClass('collapsed');
				$edit_wrap.addClass('collapsed');
				if(!$data_wrap.hasClass('collapsed')){
					$("html,body").animate({scrollTop:200},200);
				}
			});


			/*最小化窗口*/
			$edit_title.next().on('click',function(e){
				if($data_wrap.hasClass('collapsed')){
					e.stopPropagation();
					e.preventDefault();
					$edit_cance_btn.trigger('click');
				}
			});


			/*添加文章广告*/
			$article_add_btn.on('click',function(e){
				e.preventDefault();
				//重置表单
				edit_form.reset();
				$edit_title.html('添加文章广告');
				/*重置编辑器*/
				editor.html('');
				/*调整布局*/
				$data_wrap.addClass('collapsed');
				$edit_wrap.removeClass('collapsed');
				$("html,body").animate({scrollTop:300},200);
				//第一行获取焦点
				$article_title.focus();
			});
			if(typeof powermap[11]!=='undefined'){
				$article_add_btn.removeClass('g-d-hidei');
				$edit_wrap.removeClass('g-d-hidei');
			}


			/*缩略图文件上传初始化*/
			var img_token=getToken();
			if(img_token!==null){
				// domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
				// uploader为一个plupload对象，继承了所有plupload的方法
				var thumbnail_upload = Qiniu.uploader({
							runtimes: 'html5,flash,html4',
							browse_button: 'img-url-upload',// 上传选择的点选按钮，必需
							uptoken :img_token.qiniuToken,// uptoken是上传凭证，由其他程序生成
							get_new_uptoken: false,// 设置上传文件的时候是否每次都重新获取新的uptoken
							//downtoken_url: '/downtoken',
							//Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
							unique_names:false,// 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
							save_key:false,//默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
							domain:img_token.qiniuDomain,//bucket域名，下载资源时用到，必需
							container:'',// 上传区域DOM ID，默认是browser_button的父元素
							max_file_size: '4mb',// 最大文件体积限制
							flash_swf_url: '../../js/plugins/plupload/Moxie.swf',//引入flash，相对路径
							max_retries: 3,// 上传失败最大重试次数
							dragdrop:false,
							drop_element:'',
							chunk_size: '2mb',
							auto_start:true,
							filters:{
								mime_types: [
									{
										title : "flv files", extensions : "flv"
									},
									{
										title : "Video files", extensions : "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"
									},
									{
										title : "Image files", extensions : "jpg,gif,png,jpeg"
									}
								]
							},
							x_vars : {
								/*查看自定义变量*/
								'time' : function(up,file) {
									var d=new Date();
									return d.getTime();
								},
								'size' : function(up,file) {
									return file.size;
								}
							},
							init: {
								'FilesAdded': function(up, files) {
									plupload.each(files, function(file) {
										// 文件添加进队列后，处理相关的事情
										console.log("plupload:",file);
									});
								},
								'BeforeUpload': function(up, file) {
									// 每个文件上传前，处理相关的事情
									console.log("BeforeUpload:",file);
								},
								'UploadProgress': function(up, file) {
									// 每个文件上传时，处理相关的事情
									console.log("UploadProgress:",file);
								},
								'FileUploaded': function(up, file, info) {
									console.log("FileUploaded:",file);
									/*每个文件上传成功后，处理相关的事情*/
									/*其中info是文件上传成功后，服务端返回的json，形式如：
									 {
									 "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
									 "key": "gogopher.jpg"
									 }*/
									var domain = up.getOption('domain');
									var res = parseJSON(info);
									var sourceLink = domain + res.key; /*获取上传成功后的文件的Url*/
									return sourceLink;
								},
								'Error': function(up, err, errTip) {
									//上传出错时，处理相关的事情
								},
								'UploadComplete': function() {
									//队列文件处理完毕后，处理相关的事情
								},
								'Key': function(up, file) {
									// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
									// 该配置必须要在unique_names: false，save_key: false时才生效

									/*var key = "";
									 return key*/
								}
							}
				});

				/*$img_url_upload.on('click',function(){
					var text=$img_url_file.val();
					if(text===''){
						dia.content('<span class="g-c-bs-warning g-btips-warn">请先选择文件</span>').show();
						setTimeout(function(){
							dia.close();
						},2000);
						return false;
					}
					/!*执行上传*!/
					thumbnail_upload.start();
				});*/

				thumbnail_upload.bind('FileUploaded',function(str){
					console.log(str);
					console.log('ok......');
				});


			}





			/*表单验证*/
			if($.isFunction($.fn.validate)) {
				/*配置信息*/
				var form_opt={};
				if(public_tool.cache.form_opt_0){
					$.extend(true,form_opt,public_tool.cache.form_opt_0,{
						submitHandler: function(form){
							//判断是否存在id号
							var id=$article_id.val(),
								times=$article_time.val().split(',');


							if(id!==''){
								//此处配置修改稿角色地址（开发阶段）
								var config={
									url:"http://120.24.226.70:8081/yttx-adminbms-api/article/advertisement/update",
									dataType:'JSON',
									method:'post',
									data:{
										articleId:id,
										adminId:decodeURIComponent(logininfo.param.adminId),
										token:decodeURIComponent(logininfo.param.token),
										title:$article_title.val(),
										content:$article_content.val(),
										startTime:times[0],
										endTime:times[1],
										thumbnail:$article_thumbnail.val(),
										belongsCompany:$article_belongscompany.val()
									}
								};
							}else{
								//此处配置添加角色地址（开发阶段）
								var config={
									url:"http://120.24.226.70:8081/yttx-adminbms-api/article/advertisement/add",
									dataType:'JSON',
									method:'post',
									data:{
										adminId:decodeURIComponent(logininfo.param.adminId),
										token:decodeURIComponent(logininfo.param.token),
										title:$article_title.val(),
										content:$article_content.val(),
										startTime:times[0],
										endTime:times[1],
										thumbnail:$article_thumbnail.val(),
										belongsCompany:$article_belongscompany.val()
									}
								};
							}

							$.ajax(config)
								.done(function(resp){
									var code=parseInt(resp.code,10);
									if(code!==0){
										console.log(resp.message);
										setTimeout(function(){
											id!==''?dia.content('<span class="g-c-bs-warning g-btips-warn">修改文章广告失败</span>').show():dia.content('<span class="g-c-bs-warning g-btips-warn">添加文章广告失败</span>').show();
										},300);
										setTimeout(function () {
											dia.close();
										},2000);
										return false;
									}
									//重绘表格
									getColumnData(article_page,article_config);
									//重置表单
									$edit_cance_btn.trigger('click');
									setTimeout(function(){
										id!==''?dia.content('<span class="g-c-bs-success g-btips-succ">修改文章广告成功</span>').show():dia.content('<span class="g-c-bs-success g-btips-succ">添加文章广告成功</span>').show();
									},300);
									setTimeout(function () {
										dia.close();
									},2000);
								})
								.fail(function(resp){
									console.log(resp.message);
								});
							return false;
						}
					});
				}
				/*提交验证*/
				$article_edit_form.validate(form_opt);
			}



		}


		/*获取数据*/
		function getColumnData(page,opt){
			if(table===null){
				table=opt.$ad_article_wrap.DataTable(opt.config);
			}else{
				table.ajax.config(opt.config.ajax).load();
			}
		};
		/*获取七牛token*/
		function getToken(){
			var result=null;
			$.ajax({
				url:'http://120.24.226.70:8081/yttx-adminbms-api/commom/getQiniuToken',
				async:false,
				type:'post',
				datatype:'json',
				data:{
					bizType:"2",
					adminId:decodeURIComponent(logininfo.param.adminId),
					token:decodeURIComponent(logininfo.param.token)
				}
			}).done(function(resp){
				var code=parseInt(resp.code,10);
				if(code!==0){
					console.log(resp.message);
					return false;
				}
				result=resp.result;
			}).fail(function(resp){
				console.log(resp.message);
			});
			return result;
		}





	});


})(jQuery,KindEditor);