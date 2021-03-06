/*配置依赖*/
require.config({
	baseUrl:'../../../js/',
	paths:{
		'jquery':'lib/jquery/jquery-1.11.2.min',
		'dialog':'lib/artDialog/dialog',
		'share':'plugins/share',
		'common':'common/common',
		'company_common':'common/company_common',
		'slide':'widgets/slide',
		'rule':'widgets/rules',
		'commonfn':'widgets/commonfn',
		'validform':'plugins/validform',
		'city_select':'widgets/city_select',
		'cookie':'plugins/cookie',
		'modal_dialog':'widgets/modal_dialog'
	},
	shim:{
		'dialog':{
				deps:['jquery']
		},
		'validform':{
			deps:['jquery']
		}
	},
	waitSeconds:15
});


/*程序入口*/
require(['jquery','dialog','share','slide','rule','commonfn','validform','city_select','modal_dialog','cookie','common','company_common'],function($,undefined,Share,Slide,Rule,CommonFn,undefined,City_Select,Modal_Dialog,undefined,Common,Company_Common) {
	$(function() {
		
			//获取页面传值id
			var curid=Common.getID('company_params');
			console.log(curid);
		
		
			//轮播动画
			Slide.slideToggle({
					$wrap:$('#slideimg_show'),
					$slide_img:$('#slide_img'),
					$btnwrap:$('#slideimg_btn'),
					$slide_tipwrap:$('#slide_tips'),
					minwidth:300,
					times:6000,
					eff_time:500,
					btn_active:'slidebtn-active'
			});
					
			
			
			
			
	});
});


