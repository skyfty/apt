define(['jquery', 'backend', 'table', 'form','template','angular','cosmetic'], function ($, Backend, Table, Form, Template,angular, Cosmetic) {
    var Controller = {
        //for index
        lands:{
            index:function($scope, $compile,$timeout, data) {

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