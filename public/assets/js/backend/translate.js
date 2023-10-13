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
                        index_url: 'translate/index',
                        add_url: 'translate/add',
                        del_url: 'translate/del',
                        multi_url: 'translate/multi',
                        summation_url: 'translate/summation',
                        table: 'translate',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.name);
                            },
                            classname: 'btn btn-xs  btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'translate/view'
                        }
                    ]
                };
                Table.api.init(options);
                Form.api.bindevent($("div[ng-controller='index']"));
            },
        },
        list: function () {
            AngularApp.controller("list", function($scope, $compile,$timeout) {
                $scope.allFields = Config.allFields;
                $scope.fields = $scope.allFields;
                $scope.sceneryInit = function() {
                    $scope.searchFieldsParams = function (param) {
                        param.ids =row.id;
                        return param;
                    };
                    var options = {
                        extend: {
                            index_url: 'translate/list',
                            add_url: 'translate/add',
                            del_url: 'translate/del',
                            multi_url: 'translate/multi',
                            summation_url: 'translate/summation',
                            table: 'translate',
                        },
                        buttons: []
                    };
                    Table.api.init(options);
                    Form.api.bindevent($("div[ng-controller='list']"));
                    $timeout(function(){
                        $scope.$broadcast("shownTable");
                    });
                };
            });
        },

        viewscape:function($scope, $compile,$parse, $timeout){
            $scope.refreshRow = function(){
                $.ajax({url: "translate/index",dataType: 'json',
                    data:{
                        custom: {"translate.id":$scope.row.id}
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



        },

        bindevent:function($scope){
            Form.api.bindevent($("form[role=form]"), $scope.submit);
        },


        initParam:[
            'internationalization_model_id'],
        add: function () {
            var self = this;
            AngularApp.controller("add", function($scope,$sce, $compile,$timeout){
                $scope.fields = Config.scenery.fields;
                $scope.pre ={}; $scope.row = {};
                $scope.row['branch_model_id'] = Config.admin_branch_model_id!= null?Config.admin_branch_model_id:0;
                $scope.row['creator_model_id'] = $scope.row['owners_model_id'] = Config.admin_id;

                for(var i in self.initParam) {
                    var param = Backend.api.query(self.initParam[i]);
                    if (param) {
                        $scope.pre[self.initParam[i]] = $scope.row[self.initParam[i]] = param;
                    }
                }
                var html = Template("edit-tmpl",{state:"add",'fields':"fields"});
                $timeout(function(){
                    $("#data-view").html($compile(html)($scope));
                    $timeout(function(){
                        self.bindevent($scope, $timeout,$compile);
                    });
                });
            });
        },
        api: {
        }
    };
    Controller.api = $.extend(Cosmetic.api, Controller.api);
    return $.extend(Cosmetic, Controller);
});