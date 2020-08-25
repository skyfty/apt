define(['jquery', 'backend', 'table', 'form','template','angular','cosmetic'], function ($, Backend, Table, Form, Template,angular, Cosmetic) {
    var Controller = {

        lands:{
            index:function($scope, $compile,$timeout, data) {
                var options = {
                    extend: {
                        index_url: 'branch/index',
                        add_url: 'branch/add',
                        del_url: 'branch/del',
                        multi_url: 'branch/multi',
                        summation_url: 'branch/summation',
                        table: 'branch',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __('%s', row.name);
                            },
                            classname: 'btn btn-xs  btn-success btn-magic btn-addtabs btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'branch/view'
                        }
                    ]
                };
                Table.api.init(options);
                Form.api.bindevent($("div[ng-controller='index']"));
            }
        },

        scenery: {

            staff: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "branch_model_id":$scope.row.id,
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
                            url: 'staff/hinder'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
        },
        viewscape:function($scope, $compile,$parse, $timeout){
            $scope.refreshRow = function(){
                $.ajax({url: "branch/index",dataType: 'json',
                    data:{
                        custom:{id:$scope.row.id}
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
        select:function(){
            Form.api.bindevent($("[role='form']"));
        },
        chart:function() {
            AngularApp.controller("chart", function($scope,$sce, $compile,$timeout) {
                $scope.stat = {};
                $scope.refresh = function(){
                    $.ajax({url: "branch/statistic",dataType: 'json',cache: false,
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