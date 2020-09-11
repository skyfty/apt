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
                        index_url: 'wealth/index',
                        add_url: 'wealth/add',
                        del_url: 'wealth/del',
                        multi_url: 'wealth/multi',
                        summation_url: 'wealth/summation',
                        table: 'wealth',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.name);
                            },
                            classname: 'btn btn-xs  btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'wealth/view'
                        },
                        {
                            name: 'convert',
                            confirm: function(row, j){
                                return row.form == "normal"?'确定要转换为标准资源吗':'确定要转换为普通资源吗';
                            },
                            classname: 'btn btn-xs  btn-success btn-magic btn-ajax',
                            icon:  function(row, j){
                                return row.form == "normal"?'fa fa-american-sign-language-interpreting':'fa fa fa-certificate';
                            },
                            refresh:true,
                            url: function(row, j){
                                var url = 'wealth/convert/form/' + (row.form == "normal"?'standard':'normal');
                                return Fast.api.fixurl(Table.api.replaceurl(url, row, this))
                            }
                        }
                    ]
                };
                Table.api.init(options);
                Form.api.bindevent($("div[ng-controller='index']"));
            }
        },
        viewscape:function($scope, $compile,$parse, $timeout){
            $scope.refreshRow = function(){
                $.ajax({url: "wealth/index",dataType: 'json',
                    data:{
                        custom: {"wealth.id":$scope.row.id}
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
            var self = this;

            Form.api.bindevent($("form[role=form]"), $scope.submit);
            require(['selectpage'], function () {
                for (var i in self.initParam) {
                    var param = Backend.api.query(self.initParam[i]);
                    if (param) {
                        $('[name="row[' + self.initParam[i] + ']"]').selectPageDisabled(true);
                    }
                }
            });
            if (Config.staff) $('[data-field-name="branch"]').hide().trigger("rate");
        },


        initParam:[
            'promotion_model_id'],
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