/*login*/
(function($){
	$(function(){

		//dom节点引用或者其他变量定义
		var $loginform=$('#login'),
			$username=$('#username'),
			$pwd=$('#passwd'),
			$vcode=$('#validcode');
			$error_wrap=$('#error_wrap'),
			$validcode_btn=$('#validcode_btn'),
			$validimg=$validcode_btn.find('img'),
			error_tpl='<div class="alert alert-danger">\
								<button type="button" class="close" data-dismiss="alert">\
									<span aria-hidden="true">&times;</span>\
									<span class="sr-only">Close</span>\
								</button>\$info\
							</div>';

		//初始化效果
		setTimeout(function(){
			$(".fade-in-effect").addClass('in');
		},1);


		//异步校验
		$loginform.validate({
			rules: {
				username: {
					required: true
				},
				passwd: {
					required: true,
					minlength:6
				},
				validcode:{
					required:true
				}
			},

			messages: {
				username: {
					required: '请输入用户名'
				},
				passwd: {
					required: '请输入密码',
					minlength:'密码必须超过6位字符'
				},
				validcode:{
					required:'验证码不能为空'
				}
			},

			//提交表单
			submitHandler: function(form){
				show_loading_bar(70);

				var opts = {
					"closeButton": true,
					"debug": false,
					"positionClass": "toast-top-full-width",
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "5000",
					"extendedTimeOut": "1000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut"
				};

				$.ajax({
					url: "../../json/account/login.json",
					method: 'POST',
					dataType: 'json',
					data: {
						do_login: true,
						username:$username.val(),
						passwd:$pwd.val(),
						validcode:$vcode.val()
					}
				}).done(function(resp){
					//调用进度条组件
					show_loading_bar({
						delay: .5,
						pct: 100,
						finish: function(){
							if(resp.flag){
								//成功后跳入主页面
								location.href = '../index.html';
							}
						}
					});


					//移除提示的错误信息
					$error_wrap.find('.alert').slideUp('fast');


					//显示错误
					if(!resp.flag){
						$error_wrap.html(error_tpl.replace('$info',resp.message));
						$error_wrap.find('.alert').hide().slideDown();
						$pwd.select();
					}

				}).fail(function(){
					//移除提示的错误信息
					$error_wrap.find('.alert').slideUp('fast');
					//显示错误信息
					$error_wrap.html(error_tpl.replace('$info','登陆失败请重新登陆'));
					$error_wrap.find('.alert').hide().slideDown();
					$pwd.select();
				});

			}
		});

		//设置获取焦点
		$loginform.find(".form-group:has(.form-control):first .form-control").focus();


		/*重新生成验证码*/
		$validcode_btn.on('click',function(){
			$.ajax({
				url: "../../json/account/login.json",
				method: 'POST',
				dataType: 'json'
			}).done(function(resp){
				if(resp.flag){
					$validimg.attr({'src':resp.src});
				}
			}).fail(function(){

			});

		});


	});
})(jQuery);