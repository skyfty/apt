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
        },

        bindevent:function($scope){
            Form.api.bindevent($("form[role=form]"), $scope.submit);
        },

        chart:function() {
            AngularApp.controller("chart", function($scope,$sce, $compile,$timeout) {
                $scope.stat = {};
                $scope.refresh = function(){
                    $.ajax({url: "promotion/statistic",dataType: 'json',cache: false,
                        success: function (ret) {
                            $scope.$apply(function(){
                                $scope.stat = ret.data;
                            });
                        }
                    });
                };
                $scope.$on("refurbish", $scope.refresh);$scope.refresh(); $(".btn-refresh").on("click", $scope.refresh);
            });
        },
        api: {
        }
    };
    Controller.api = $.extend(Cosmetic.api, Controller.api);
    return $.extend(Cosmetic, Controller);
});