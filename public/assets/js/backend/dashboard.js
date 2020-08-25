define(['jquery', 'bootstrap', 'backend', 'addtabs', 'table', 'echarts', 'echarts-theme', 'template', 'form'], function ($, undefined, Backend, Datatable, Table, Echarts, undefined, Template, Form) {
    var Controller = {
        calendar: function() {
            var selected = [];
            require(['jquery-ui.min', 'fullcalendar', 'fullcalendar-lang'], function () {
                var events = {
                    url: "calendar/index",
                    data: function () {
                        var adminIds = [];
                        if (selected.length > 0) {
                            $.each(selected, function(i, v){
                                adminIds.push(v.data.admin_id);
                            });
                        }
                        return {admin_id: adminIds};
                    }
                };
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay, listMonth'
                    },
                    dayClick: function (date, jsEvent, view) {
                    },
                    eventClick: function (calEvent, jsEvent, view) {
                    },
                    events: events,
                    navLinks: true,
                    eventAfterAllRender: function (view) {
                        $("a.fc-event[href]").attr("target", "_blank");
                    }
                });
            });

            require(['jstree'], function () {
                //全选和展开
                $("#checkall", "#staff-calendar").on("click", function () {
                    $("#channeltree").jstree($(this).prop("checked") ? "check_all" : "uncheck_all");
                });

                $('#channeltree').on("changed.jstree", function (e, data) {
                    selected = $("#channeltree").jstree().get_checked(true);
                    $('#calendar').fullCalendar('refetchEvents');
                    return false;
                });
                $('#channeltree').jstree({
                    "themes": {
                        "stripes": true
                    },
                    "checkbox": {
                        "keep_selected_style": false,
                    },
                    "types": {
                        "list": {
                            "icon": "fa fa-user-secret",
                        }
                    },
                    'plugins': ["types", "checkbox"],
                    "core": {
                        "multiple": true,
                        'check_callback': true,
                        'data' : function (obj, callback) {
                            var content = $("#search-content").val();
                            $.ajax({
                                url: 'staff/index',
                                dataType: 'json',
                                data: {
                                    search: content
                                },
                                success: function (data) {
                                    selected = [];
                                    var staffList = [];
                                    $.each(data.rows, function (k, v) {
                                        if (v.admin_id) {
                                            staffList.push({
                                                'id': "tree_" + v['id'],
                                                'parent': '#',
                                                'text': v.name + "," + v.idcode,
                                                'type': "list",
                                                'data': v,
                                            });
                                        }
                                    });
                                    callback(staffList);
                                    $('#calendar').fullCalendar('refetchEvents');
                                }
                            });
                        }
                    }
                });
            });


            $("#search-btn").click(function(){
                $('#channeltree').jstree(true).refresh();
            });
            $("#search-btn").trigger("click");
        },
        index: function () {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var panel =$(this).attr("href");
                if (panel == "#staff-calendar") {
                    Controller.calendar();
                }
                $(this).unbind('shown.bs.tab');
            });
            $.ajax({url: '/note/index', type: 'get',
                data:{
                    'limit':6,
                    'custom':{
                        'status':'normal',
                        'flag':'nav'
                    },
                },
                success: function (data) {
                    $("#news-list").html(Template("newstpl", {news: data.rows}));
                }
            });


            Form.api.bindevent($('#echart-options'));

        }
    };

    return Controller;
});