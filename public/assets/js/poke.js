define(['template', 'moment', 'fast'], function (Template, Moment, Fast) {
    var Poke = {
        api: {
            loadlist: function (url, custom, offset,limit) {
                var self = this;
                var deferred = $.Deferred();
                $.extend(custom, {
                    'offset': offset,
                    'limit': limit,
                });
                $.ajax({type: "GET", url:url,
                    data: custom
                }).then(function(ret){
                    if (ret && ret.rows && ret.rows.length > 0) {
                        deferred.resolve(ret);
                    }
                });
                return deferred.promise();
            }
        },
        init: function () {
            $("#form").data("validator-options", {
                invalid: function (form, errors) {
                    $.each(errors, function (i, j) {
                        Toastr.error(j);
                    });
                },
                target: '#errtips'
            });
        },

    };
    //将Template渲染至全局,以便于在子框架中调用
    window.Template = Template;
    //将Moment渲染至全局,以便于在子框架中调用
    window.Moment = Moment;
    //将Staff渲染至全局,以便于在子框架中调用
    window.Poke = Poke;

    Poke.init();

    return Poke;
});
