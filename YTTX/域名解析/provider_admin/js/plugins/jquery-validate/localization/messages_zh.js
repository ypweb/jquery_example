/**
name:agent_admin / messages_zh;
 author:yipin;
 date:2016-07-12;
 version:1.0.0**/
!function(a){"function"==typeof define&&define.amd?define(["jquery","../jquery.validate"],a):a(jQuery)}(function(a){a.extend(a.validator.messages,{required:"必须填写",remote:"请修正此栏位",email:"请输入有效的电子邮件",zh_phone:"请输入电话号码",poe:"请输入电话号码或者邮箱",num:"请输入数字",money:"请输入货币",url:"请输入有效的网址",date:"请输入有效的日期",dateISO:"请输入有效的日期 (YYYY-MM-DD)",number:"请输入正确的数字",digits:"只可输入数字",creditcard:"请输入有效的信用卡号码",equalTo:"你的输入不相同",extension:"请输入有效的后缀",maxlength:a.validator.format("最多 {0} 个字"),minlength:a.validator.format("最少 {0} 个字"),rangelength:a.validator.format("请输入长度为 {0} 至 {1} 之間的字串"),range:a.validator.format("请输入 {0} 至 {1} 之间的数值"),max:a.validator.format("请输入不大于 {0} 的数值"),min:a.validator.format("请输入不小于 {0} 的数值")})});