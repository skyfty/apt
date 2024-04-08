define(['jquery', 'backend', 'table', 'form','template','angular','cosmetic'], function ($, Backend, Table, Form, Template,angular, Cosmetic) {
    var Controller = {
        //for index
        lands:{
            index:function($scope, $compile,$timeout, data) {
                $scope.searchFieldsParams = function(param) {
                    param.custom = {};
                    return param;
                };
                var options = {
                    extend: {
                        index_url: 'promotion/index',
                        add_url: 'promotion/add',
                        del_url: 'promotion/del',
                        multi_url: 'promotion/multi',
                        summation_url: 'promotion/summation',
                        table: 'promotion',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.name);
                            },
                            classname: 'btn btn-xs  btn-success btn-magic btn-addtabs btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'promotion/view'
                        }
                    ]
                };
                Table.api.init(options);
                Form.api.bindevent($("div[ng-controller='index']"));
            }
        },
        viewscape:function($scope, $compile,$parse, $timeout){
            $scope.refreshRow = function(){
                $.ajax({url: "promotion/index",dataType: 'json',
                    data:{
                        custom: {"promotion.id":$scope.row.id}
                    },
                    success: function (data) {
                        if (data && data.rows && data.rows.length == 1) {
                            $scope.$apply(function(){
                                $parse("row").assign($scope, data.rows[0]);
                            });
                        }
                    }
                });
            };
        },
        scenery: {
            compilation: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "promotion_model_id":$scope.row.id,
                    };
                    return param;
                };

                Table.api.init({
                    extend: {
                        index_url: 'compilation/index',
                        add_url: 'compilation/add',
                        del_url: 'compilation/del',
                        multi_url: 'compilation/multi',
                        summation_url: 'compilation/summation',
                        table: 'compilation',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'compilation/view'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
            trap: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "promotion_model_id":$scope.row.id,
                    };

                    return param;
                };

                Table.api.init({
                    extend: {
                        index_url: 'trap/index',
                        add_url: 'trap/add',
                        del_url: 'trap/del',
                        multi_url: 'trap/multi',
                        summation_url: 'trap/summation',
                        table: 'trap',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'trap/view'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
            internationalization: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "promotion_model_id":$scope.row.id,
                    };

                    return param;
                };

                $scope.translate = function() {
                    Fast.api.ajax({
                        url: "promotion/translate",
                        data: {ids:$scope.row.id},
                    });
                };

                Table.api.init({
                    extend: {
                        index_url: 'internationalization/index',
                        add_url: 'internationalization/add',
                        del_url: 'internationalization/del',
                        multi_url: 'internationalization/multi',
                        summation_url: 'internationalization/summation',
                        table: 'internationalization',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'internationalization/view'
                        },

                        {
                            name: 'translates',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-deviantart',
                            url: 'translate/list'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
            cause: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "cause.promotion_model_id":$scope.row.id,
                    };

                    var trap_model_id = $('#trap_model_id').val();
                    if (trap_model_id) {
                        param.custom["cause.trap_model_id"] = trap_model_id;
                    }
                    var channel_model_id = $('#channel_model_id').val();
                    if (channel_model_id) {
                        param.custom["cause.channel_model_id"] = channel_model_id;
                    }
                    var ip_address = $('#ip_address').val();
                    if (ip_address) {
                        param.custom["cause.ip_address"] = ip_address;
                    }
                    return param;
                };

                Table.api.init({
                    extend: {
                        index_url: 'cause/index',
                        add_url: 'cause/add',
                        del_url: 'cause/del',
                        multi_url: 'cause/multi',
                        summation_url: 'cause/summation',
                        table: 'cause',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'cause/view'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");

                require(['selectpage'], function () {
                    var options = {
                        eAjaxSuccess: function (data) {
                            data.list = data.list || [];
                            data.totalRow = data.total || 0;
                            return data;
                        },
                        eSelect:function(data) {
                            $("#table-cause").bootstrapTable('refresh', {});
                        },
                        params:function(){
                            var param = {
                                'promotion_model_id':$scope.row.id
                            };
                            return param;
                        },
                        eClear:function(){
                            $("#table-cause").bootstrapTable('refresh', {});
                        }
                    };
                    $('#trap_model_id').selectPage(options);

                    $.extend(options, { params:false});
                    $('#channel_model_id').selectPage(options);

                    $("#ip_address").on("blur", function(){
                        $("#table-cause").bootstrapTable('refresh', {});
                    });

                });

            },
            storehouse: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "promotion_model_id":$scope.row.id,
                    };

                    return param;
                };


                $scope.formaterColumn = function(j, data) {
                    if (data.field == "estate_id") {
                        data.formatter = function (value, row, index) {
                            var html = "";
                            if (typeof row['estate_info'] != "undefined") {
                                for(var i = 0; i < row['estate_info'].length; ++i) {
                                    var estate_info = row['estate_info'][i];
                                    html += estate_info['title'] + ": " + estate_info['value'] + ", ";
                                }
                            }
                            return html;
                        }
                    }
                    return data;
                };


                Table.api.init({
                    extend: {
                        index_url: 'storehouse/index',
                        add_url: 'storehouse/add',
                        del_url: 'storehouse/del',
                        multi_url: 'storehouse/multi',
                        summation_url: 'storehouse/summation',
                        table: 'storehouse',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'storehouse/view'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
            stuff: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "promotion_model_id":$scope.row.id,
                    };

                    return param;
                };


                Table.api.init({
                    extend: {
                        index_url: 'stuff/index',
                        add_url: 'stuff/add',
                        del_url: 'stuff/del',
                        multi_url: 'stuff/multi',
                        summation_url: 'stuff/summation',
                        table: 'stuff',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'stuff/view'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
        },

        bindevent:function($scope){
            Form.api.bindevent($("form[role=form]"), $scope.submit);
        },

        chart:function() {
            AngularApp.controller("chart", function($scope,$sce, $compile,$timeout, $parse) {
                $scope.search = {
                    promotion:5
                };
                $scope.graph = function(){
                    let url = $("#nav-channel-echart [role='presentation'].active").data("url");
                    if ($scope.search && $scope.search.channel) {
                        url += "&channel=" + $scope.search.channel;
                    }
                    if ($scope.search && $scope.search.promotion) {
                        url += "&id=" + $scope.search.promotion;
                    }
                    return url;
                };

                Fast.api.ajax({
                    url:"promotion/statistic",
                    data: {id:5}
                }, function (data, ret) {
                    $scope.$apply(function(){
                        $parse("stat").assign($scope, data);
                    });
                    return false;
                });


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
                Form.api.bindevent($("div[ng-controller='chart']"));

                $timeout(function(){

                    $("#daterange").trigger("applyPicker");

                },2000);


                $("#nav-channel [role='presentation']").on("click", function(){
                    $("#nav-channel [role='presentation']").removeClass("active");
                    $(this).addClass("active");
                    $(".tab-content .tab-pane").removeClass("active");
                    $("#" + $(this).data("tid")).addClass("active");

                });


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
                            {field: 'title', title: '渠道名称', align: 'left',sortable:true},
                            {field: 'increased', title: '新增用户', align: 'left',sortable:true},
                            {field: 'active', title: '活跃用户', align: 'left',sortable:true},
                            {field: 'total', title: '累计用户', align: 'left',sortable:true},

                        ]
                    ],
                    queryParams: function (params) {

                        return params;
                    },
                    search: false, //是否启用快速搜索
                    commonSearch: false, //是否启用通用搜索
                    showExport: false,
                    showToggle: false,

                };
                // 初始化表格
                table.bootstrapTable(tableOptions);
                // 为表格绑定事件
                Table.api.bindevent(table);


                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        add_url: '',
                        index_url: 'statistic/cause',
                        del_url: '',
                        table: 'statistic',
                    }
                });
                var tablecause = $("#table-cause");

                var tableOptions = {
                    toolbar: "#toolbar-cause",
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    pk: 'id',
                    columns: [
                        [
                            {field: 'name', title: '行为', align: 'left',sortable:true},
                            {field: 'describe', title: '说明', align: 'left',sortable:true},
                            {field: 'amount', title: '数量', align: 'left',sortable:true},
                        ]
                    ],
                    queryParams: function (params) {

                        return params;
                    },
                    search: false, //是否启用快速搜索
                    commonSearch: false, //是否启用通用搜索
                    showExport: false,
                    showToggle: false,

                };
                // 初始化表格
                tablecause.bootstrapTable(tableOptions);
                // 为表格绑定事件
                Table.api.bindevent(tablecause);

            });
        },
        api: {
        }
    };
    Controller.api = $.extend(Cosmetic.api, Controller.api);
    return $.extend(Cosmetic, Controller);
});