define(['jquery', 'backend', 'table', 'form','template','angular','cosmetic'], function ($, Backend, Table, Form, Template,angular, Cosmetic) {
    var Controller = {
        //for index
        lands:{
            index:function($scope, $compile,$timeout, data,$parse) {
                let table_scope = angular.element('#table-index').scope();

                $scope.filter = function() {
                    table_scope.complexSearchCondition = [];
                    $(".form-commonsearch input").each(function(){
                        let name = $(this).data("name");
                        let val =  $parse("search." + name)($scope);
                        if (val === "" || val == null) {
                            return;
                        }
                        let field = {
                            name:name,
                            type:$(this).data("type"),
                            relevance:$(this).data("relevance"),
                        };
                        let condition = $(this).data("condition");
                        if (!condition) {
                            condition = Controller.api.getCondition(field.type);
                        }
                        let co = {
                            field:field,
                            value:val,
                            condition:condition
                        };
                        table_scope.complexSearchCondition.push(co);
                    });
                    $scope.refurbishSearch("index");
                };

                $scope.searchFieldsParams = function(param) {
                    param.custom = {};
                    return param;
                };
                var options = {
                    search: false, //是否启用快速搜索
                    cache: false,
                    commonSearch: false, //是否启用通用搜索
                    searchFormVisible: false, //是否始终显示搜索表单
                    extend: {
                        index_url: 'statistic/index',
                        add_url: '',
                        del_url: '',
                        multi_url: '',
                        summation_url: '',
                        table: 'cause',
                    },
                    buttons : []
                };
                Table.api.init(options);
                Form.api.bindevent($("div[ng-controller='index']"));
            },
        },
        customer: function () {
            AngularApp.controller("customer", function($scope, $compile,$timeout) {
                $scope.graph = function(){
                    let url = $("#nav-customer-echart [role='presentation'].active").data("url");
                    return url;
                };

                $("#nav-customer-echart [role='presentation']").on("click", function(){
                    $("#nav-customer-echart [role='presentation']").removeClass("active");
                    $(this).addClass("active");
                    angular.element("#c-echarts").scope().refresh();
                });
            });
        },

        channel: function () {
            AngularApp.controller("channel", function($scope, $compile,$timeout) {
                $scope.graph = function(){
                    let url = $("#nav-channel-echart [role='presentation'].active").data("url");
                    if ($scope.search && $scope.search.channel) {
                        url += "&channel=" + $scope.search.channel;
                    }
                    return url;
                };

                $("#nav-channel-echart [role='presentation']").on("click", function(){
                    $("#nav-channel-echart [role='presentation']").removeClass("active");
                    $(this).addClass("active");
                    angular.element("#c-echarts").scope().refresh();
                });

                $scope.$watch("search.channel", function($new){
                    if ($new) {
                        angular.element("#c-echarts").scope().refresh();
                    }
                });
                Form.api.bindevent($("div[ng-controller='channel']"));

                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        add_url: '',
                        index_url: 'statistic/channel',
                        del_url: '',
                        table: 'statistic',
                    }
                });
                var table = $("#table-channel");

                var tableOptions = {
                    toolbar: "#toolbar-channel",
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    pk: 'id',
                    columns: [
                        [
                            {checkbox: true},
                            {field: 'title', title: '渠道名称', align: 'left'},
                            {field: 'title', title: '新增用户', align: 'left'},
                            {field: 'title', title: '活跃用户', align: 'left'},
                            {field: 'title', title: '累计用户', align: 'left'},

                        ]
                    ],
                    queryParams: function (params) {

                        return params;
                    },
                    search: false, //是否启用快速搜索
                    commonSearch: false, //是否启用通用搜索
                    showExport: false,
                };
                // 初始化表格
                table.bootstrapTable(tableOptions);
                // 为表格绑定事件
                Table.api.bindevent(table);
            });
        },
        viewscape:function($scope, $compile,$parse, $timeout){

        },
        scenery: {

        },


        bindevent:function($scope){
            var self = this;


        },

        api: {
        }
    };
    Controller.api = $.extend(Cosmetic.api, Controller.api);
    return $.extend(Cosmetic, Controller);
});