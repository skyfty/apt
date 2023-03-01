define(['jquery', 'backend', 'table', 'form','template','angular','cosmetic'], function ($, Backend, Table, Form, Template,angular, Cosmetic) {
    var Controller = {
        //for index
        lands:{
            index:function($scope, $compile,$timeout, data) {

                $scope.filter = function() {
                    console.log("lskdjf");
                    Controller.api.open
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
                        index_url: 'cause/index',
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


            }
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