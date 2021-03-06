define(['jquery', 'backend', 'table', 'form','template','angular','cosmetic','ztree'], function ($, Backend, Table, Form, Template,angular, Cosmetic,Ztree) {
    var Controller = {
        lands:{
            index:function($scope, $compile,$timeout, data) {
                var options = {
                    extend: {
                        index_url: 'article/index',
                        add_url: 'article/add',
                        del_url: 'article/del',
                        summation_url: 'article/summation',
                        table: 'article',
                    },
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __('%s', row.idcode);
                            },
                            classname: 'btn btn-xs  btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'article/view'
                        }
                    ]
                };
                Table.api.init(options);
                var table = $("#table-index");

                $scope.searchFieldsParams = function(param) {
                    param.custom = {};

                    return param;
                };

                Form.api.bindevent($("div[ng-controller='index']"));
            }
        },
        viewscape:function($scope, $compile,$parse, $timeout){
            $scope.refreshRow = function(){
                $.ajax({url: "article/index",dataType: 'json',
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
        scenery: {

        },

        bindevent:function($scope) {
            $scope.submit = function(data, ret){
                if ($(document.body).hasClass("is-dialog")) {
                    Backend.api.close();
                } else {
                    Backend.api.addtabs("article/view/ids/" + data.id, __('%s',data.idcode));
                    Backend.api.closetabs('article/add');
                }
            };
            Form.api.bindevent($("form[role=form]"), $scope.submit);

            $('[name="row[type]"]').change(function(){
                var type = $(this).val();
                if (typeof Form.formatter[type] == "undefined") {
                    type = "text";
                }
                var field = {"name":"content","type":type};
                if ($scope.row.id) {
                    var html = $(Form.formatter[type]("edit",field, $scope.row['content'], $scope.row));
                } else {
                    var html = $(Form.formatter[type]("add",field, "", {}));
                }
                $('[name="row[content]"]').parents("magicfield").html(html);
                Form.api.bindevent($("form[role=form]"), $scope.submit);
            }).trigger("change");
            if (Config.admin_branch_model_id != null)$('[data-field-name="branch"]').hide().trigger("rate");
        },

        api: {

        }
    };
    Controller.api = $.extend(Cosmetic.api, Controller.api);
    return $.extend(Cosmetic, Controller);
});