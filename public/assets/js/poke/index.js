define(['jquery', 'bootstrap', 'poke'], function ($, undefined, Poke) {
    var Controller = {
        index: function () {

        },

        api: {
        },
        init: function () {

        }
    };
    Controller.api = $.extend(Poke.api, Controller.api);

    return Controller;
});