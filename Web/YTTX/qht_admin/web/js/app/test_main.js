'use strict';

/*控制器设置基本配置*/

(function () {
  angular.module('app')
      .controller('SupportController', ['toolUtil',function(toolUtil) {
        this.isSupport=toolUtil.isSupport();
    }])
      .controller('LoginController',['loginService',function (loginService) {
          var self=this,
          login=loginService.isLogin(),
          requrl="/sysuser/login";

          /*模型*/
          this.isLogin=login;

          this.login={
              username:'',
              password:'',
              identifyingCode:''
          };
          /*绑定提交*/
          this.submitLogin=function (isValid) {
              if(isValid){
                  /*校验成功*/
                  loginService.reqLogin({
                      url:requrl,
                      method: 'POST',
                      dataType: 'json',
                      async:false,
                      data:self.login
                  }).then(function(resp){
                     self.isLogin=loginService.reqAction(resp,self.login);
                  },
                  function(resp){
                      self.isLogin=false;
                      toastr.warning(resp.message);
                  });
              }else{
                  toastr.warning('信息填写不规范');
              }
              return false;
          };
          this.getValidCode=function (wrap) {
              loginService.getValidCode({
                  wrap:wrap,
                  url:"/sysuser/identifying/code"
              });
          };
      }])
      /*.controller('AppController', ['$scope','toolUtil','toolDialog','$http',function($scope,toolUtil,toolDialog,$http){
            /!*$scope.headerdata={};
            $scope.subdata={};

            /!*初始化请求主导航menu菜单数据*!/
            $http({
                url:'json/test.json',
                method:'post',
                data:''
            })
                .then(function (resp) {
                    var datares=resp.data,
                        code=parseInt(datares.code,10);
                    if(code!==0){
                        if(code===999){
                            /!*清空缓存*!/
                            /!*public_tool.loginTips(function () {
                             public_tool.clear();
                             public_tool.clearCacheData();
                             });*!/
                        }
                        console.log(datares.message);
                        return false;
                    }
                    var result={
                        'list':[{
                            'name':'首页',
                            'href':'app'
                        },{
                            'name':'机构',
                            'href':'struct'
                        },{
                            'name':'订单管理',
                            'href':'order'
                        },{
                            'name':'财务管理',
                            'href':'finance'
                        },{
                            'name':'设备管理',
                            'href':'equipment'
                        },{
                            'name':'设置',
                            'href':'setting'
                        }]
                    };
                    if(typeof result==='undefined'){
                        return false;
                    }
                    $scope.headerdata.menuitem=result.list;
                })
                .catch(function(resp){
                    console.log(resp.message);
                    return false;
                });

            /!*退出事件*!/
            $scope.headerdata.systemLogout=function () {
                console.log('ni mei');
            };


            /!*初始化请求侧边栏数据list数据*!/
            $http({
                url:'json/test.json',
                method:'post',
                data:''
            })
                .then(function (resp) {
                    var datares=resp.data,
                        code=parseInt(datares.code,10);
                    if(code!==0){
                        if(code===999){
                            /!*清空缓存*!/
                            /!*public_tool.loginTips(function () {
                             public_tool.clear();
                             public_tool.clearCacheData();
                             });*!/
                        }
                        console.log(datares.message);
                        return false;
                    }
                    var result=Mock.mock({
                        'list|5':[{
                            "name":'list',
                            "href":'list'
                        }]
                    });
                    if(typeof result==='undefined'){
                        return false;
                    }
                    $scope.subdata.listitem=result.list;
                })
                .catch(function(resp){
                    console.log(resp.message);
                    return false;
                });

            /!*侧边栏搜索事件*!/

            /!*初始化请求侧边栏数据tab数据*!/
            $http({
                url:'json/test.json',
                method:'post',
                data:''
            })
                .then(function (resp) {
                    var datares=resp.data,
                        code=parseInt(datares.code,10);
                    if(code!==0){
                        if(code===999){
                            /!*清空缓存*!/
                            /!*public_tool.loginTips(function () {
                             public_tool.clear();
                             public_tool.clearCacheData();
                             });*!/
                        }
                        console.log(datares.message);
                        return false;
                    }
                    var result={
                        'list':[{
                            'name':'运营架构',
                            'href':'struct'
                        },{
                            'name':'角色',
                            'href':'role'
                        }]
                    };
                    if(typeof result==='undefined'){
                        return false;
                    }
                    $scope.subdata.tabitem=result.list;
                })
                .catch(function(resp){
                    console.log(resp.message);
                    return false;
                });
*!/
        }])*/;
}());


/*var dia=toolDialog.dia();
 $scope.testHaha=function(){
 toolDialog.show({
 dia:dia,
 type:'warn',
 value:'你妹，还是你妹'
 });
 };
 $scope.testHehe=function(){
 var suredia=toolDialog.sureDialog(dia);
 suredia.sure('',function(cf){
 var tip=cf.dia;
 toolDialog.show({
 dia:dia,
 type:'warn',
 value:'你妹，还是你妹'
 });
 },"是否审核该商品?",true);
 };*/
