/*首页控制器*/
angular.module('app')
    .controller('OrganizationController', ['organizationService', function (organizationService) {
        var self = this;

        /*模型--操作权限列表*/
        this.powerlist = organizationService.getCurrentPower();


        /*jquery dom缓存:主要是切换路由时，创建的dom缓存引用与现有的dom引用不一致，需要加载视图更新现有dom引用*/
        var jq_dom = {
            $admin_struct_submenu: $('#admin_struct_submenu'),
            $admin_struct_list: $('#admin_struct_list'),
            $struct_struct_dialog: $('#struct_struct_dialog'),
            $admin_struct_reset: $('#admin_struct_reset'),
            $struct_user_dialog: $('#struct_user_dialog'),
            $struct_userdetail_dialog: $('#struct_userdetail_dialog'),
            $admin_user_reset: $('#admin_user_reset'),
            $admin_userdetail_show: $('#admin_userdetail_show')
        };
        jq_dom['$admin_submenu_wrap'] = jq_dom.$admin_struct_submenu.prev();

        var jq_dom_power = {
            $power_colgroup: $('#struct_power_colgroup'),
            $power_thead: $('#struct_power_thead'),
            $power_tbody: $('#struct_power_tbody')
        };
        /*切换路由时更新dom缓存*/
        organizationService.initJQDom(jq_dom);

        /*权限初始化*/
        organizationService.initForPower({
            dom: jq_dom_power,
            isall: true
        });


        /*模型--tab选项卡*/
        this.tabitem = [{
            name: '运营机构',
            href: 'organization',
            power: self.powerlist.organization_add,
            active: 'tabactive'
        }, {
            name: '角色',
            href: 'role',
            power: self.powerlist.role_add,
            active: ''
        }];


        /*模型--机构地址*/
        this.address = {
            province: {},
            city: {},
            country: {}
        };

        /*模型--操作记录*/
        this.record = {
            searchactive: ''/*搜索激活状态(菜单栏搜索)*/,
            searchname: ''/*搜索关键词(菜单栏搜索)*/,
            prev: null/*上一次操作记录*/,
            current: null/*当前操作记录*/,
            hasdata: false/*下级是否有数据,或者是否查询到数据*/,
            currentId: ''/*虚拟挂载点*/,
            currentName: ''/*虚拟挂载点*/,
            organizationId: ''/*操作id*/,
            organizationName: ''/*操作名称*/,
            carrieroperatorId:''/*运营商Id*/,
            layer: 0/*操作层*/
        };


        /*模型--机构数据*/
        this.struct = {
            type: 'add'/*表单类型：新增，编辑；默认为新增*/,
            id: ''/*运营商ID，编辑时相关参数*/,
            sysUserId: ''/*运营商用户ID，编辑时相关参数*/,
            parentId: ''/*上级运营商ID，编辑时相关参数*/,
            fullName: ''/*运营商全称*/,
            shortName: ''/*运营商简称*/,
            adscriptionRegion: ''/*归属地区 false*/,
            linkman: ''/*负责人*/,
            cellphone: ''/*手机号码*/,
            telephone: ''/*电话号码*/,
            province: ''/*省份*/,
            city: ''/*市区*/,
            country: ''/*县区*/,
            address: ''/*详细地址*/,
            isAudited: 0/*是否已审核：0：默认，1：已审核*/,
            status: 0/*状态：0：正常，1：停用*/,
            remark: ''/*备注*/,
            isSettingLogin: 0/*是否设置登陆名及密码：1 :是*/,
            username: ''/*设置登录名*/,
            password: ''/*设置登录密码*/,
            isDesignatedPermit: 0/*是否指定权限,0:全部权限 1:指定权限*/,
            checkedFunctionIds: ''/*选中权限Ids*/
        };


        /*模型--用户(店铺)*/
        this.user = {
            type: 'add'/*表单类型：新增，编辑；默认为新增*/,
            filter: ''/*表格过滤关键词*/,
            id: ''/*用户ID，用于编辑状态*/,
            fullName: ''/*店铺全称*/,
            shortName: ''/*店铺简称*/,
            name: ''/*姓名*/,
            shoptype: 1/*店铺类型（原为type,因为user模型已经存在type,所以以shoptype代替type字段）：1 旗舰店：2 体验店：3 加盟店*/,
            cellphone: ''/*店铺手机号码*/,
            telephone: ''/*店铺电话号码*/,
            province: ''/*省份*/,
            city: ''/*市区*/,
            country: ''/*县区*/,
            address: ''/*详细地址*/,
            status: 0/*状态：0：正常，1：停用*/,
            remark: ''/*备注*/,
            addTime: ''/*添加时间,编辑时用到*/,
            organizationId: ''/*组织机构id,编辑时用到*/
        };




        /*初始化服务--虚拟挂载点，或者初始化参数*/
        organizationService.getRoot(self.record);
        /*初始化服务--初始化地址信息*/
        organizationService.queryAddress({
            type: 'province',
            address: self.address,
            model: self.struct
        });



        /*地址服务--选中地址*/
        this.changeAddress = function (model_str, address_str, type) {
            organizationService.queryAddress({
                model: self[model_str],
                address: self[address_str],
                type: type
            });
        };


        /*菜单服务--初始化请求菜单*/
        this.initSubMenu = function (type) {
            organizationService.getMenuList({
                record: self.record,
                type:type
            });
        };
        /*菜单服务--子菜单展开*/
        this.toggleSubMenu = function (e) {
            organizationService.toggleSubMenu(e, {
                record: self.record
            });
        };
        /*菜单服务--跳转至虚拟挂载点*/
        this.rootSubMenu = function (e) {
            organizationService.rootSubMenu(e, {
                record: self.record
            });
        };



        /*机构服务--操作机构表单*/
        this.actionStruct = function (config) {
            /*调用编辑机构服务类*/
            organizationService.actionStruct({
                modal: config,
                record: self.record,
                struct: self.struct,
                address: self.address
            });
        };


        /*弹出层显示隐藏*/
        this.toggleModal = function (config) {
            organizationService.toggleModal({
                display: config.display,
                area: config.area
            });
        };


        /*表单服务--提交表单*/
        this.formSubmit = function (type) {
            organizationService.formSubmit({
                struct: self.struct,
                user: self.user,
                record: self.record
            }, type);
        };
        /*表单服务--重置表单*/
        this.formReset = function (forms, type) {
            /*重置表单模型*/
            organizationService.formReset({
                forms: forms,
                struct: self.struct,
                user: self.user,
                record: self.record
            }, type);
        };
        /*表单服务--选择登录用户名和密码*/
        this.clearLoginInfo = function () {
            organizationService.clearLoginInfo(self.struct);
        };
        /*表单服务--权限服务--确定所选权限*/
        this.getSelectPower = function () {
            organizationService.getSelectPower(self.struct);
        };
        /*表单服务--权限服务--取消所选权限*/
        this.clearSelectPower = function () {
            organizationService.clearSelectPower(self.struct);
        };
        /*表单服务--权限服务--切换所选权限*/
        this.toggleSelectPower = function () {
            organizationService.toggleSelectPower({
                struct: self.struct,
                record: self.record
            });
        };


        /*搜索服务--搜索过滤*/
        this.searchAction = function () {
            organizationService.getMenuList({
                record: self.record
            });
        };
        /*搜索服务--清空过滤条件*/
        this.searchClear = function () {
            self.record.searchname = '';
            self.record.searchactive = '';
        };
        
    }]);