define(['jquery', 'bootstrap', 'poke', 'ztree', 'jsoneditor'], function ($, undefined, Poke, undefined, jsoneditor) {
    var Controller = {
        index: function () {
            $( "#card-wrapper .card" ).bindCard();
            // Let the trash be droppable, accepting the gallery items
            $( "#card-wrapper" ).droppable({
                accept: "#underpan-wrapper > .card",
                classes: {
                },
                drop: function( event, ui ) {
                    Controller.api.moveToCard( ui.draggable ).updateCardInspection();
                }
            });

            // $( "#underpan-wrapper .card" ).bindUnderpan();
            $( "#underpan-wrapper" ).droppable({
                accept: "#card-wrapper > .card",
                classes: {
                },
                drop: function( event, ui ) {
                    $("#underpan-wrapper .card.card-shadow").removeClass("card-shadow card-selected");
                    Controller.api.moveToUnderpan( ui.draggable ).updateUnderpanInspection();
                }
            }).sortable({
                start: function( event, ui ) {
                },
                stop: function( event, ui ) {//结束时触发
                }
            });

            $( "#underpan-wrapper .card" ).on("click", function(){
                $("#underpan-wrapper .card.card-shadow").removeClass("card-shadow card-selected");
                $(this).addClass("card-shadow card-selected").updateUnderpanInspection();
            });
            $("#card-number,#card-color,#card-direction,#card-zindex,#card-left,#card-top").on("change", function(){
                Controller.api.updateCardAttribute();
            });

            var zTreeObj;
            var setting = {
                callback:{
                    onClick:function(event, treeId, treeNode) {
                        $(".panel-inspection").hide();
                        $("#panel-level-inspection").show();
                        $("#card-wrapper .card.card-shadow").removeClass("card-shadow card-selected");
                    }
                }
            };
            // zTree data attributes, refer to the API documentation (treeNode data details)
            var zNodes = [
                {
                    name:"第一关",
                    open:true,
                    children:[
                        {
                            name:"台桌",
                            open:true,
                            children:[
                                {
                                    name:"A"
                                },
                                {
                                    name:"2"
                                }
                            ]
                        },
                        {
                            name:"底牌",
                            open:true,
                            children:[
                                {
                                    name:"A"
                                },
                                {
                                    name:"2"
                                }
                            ]
                        }
                    ]
                },
                {
                    name:"第二关",
                    open:false,
                    children:[
                        {
                            name:"台桌",
                            children:[
                                {
                                    name:"A"
                                },
                                {
                                    name:"2"
                                }
                            ]
                        },
                        {
                            name:"底牌",
                            children:[
                                {
                                    name:"A"
                                },
                                {
                                    name:"2"
                                }
                            ]
                        }
                    ]
                },
            ];
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);

            var n1 = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
            var n2 = ["suitdiamonds","suithearts","suitclubs","suitspades"]

            n1.forEach(function(v1){
                n2.forEach(function(v2){
                    var content = Template("tmpl-card", {number: v1, color: v2});
                    $("#underpan-wrapper").append(content);
                });
            });

        },

        api: {
            moveToCard:function ( $item ) {
                var new_item = $item.clone();
                $item.remove();
                new_item.css({"z-index": 10})
                new_item.appendTo("#card-wrapper" ).bindCard();
                return new_item;
            },
            moveToUnderpan:function($item) {
                var new_item = $item.clone();
                $item.remove();
                new_item.css({'left':"", 'top':"", 'position':"relative","z-index": 8})
                new_item.removeClass("back front card-shadow card-selected");
                new_item.appendTo("#underpan-wrapper" );

                new_item.on("click", function(){
                    $("#underpan-wrapper .card.card-shadow").removeClass("card-shadow card-selected");
                    $(this).addClass("card-shadow card-selected").updateUnderpanInspection();
                });
                return new_item;
            },
            updateCardInspection:function() {
                var cardSelected = $("#card-wrapper .card-selected");
                var direction = cardSelected.hasClass("back")?"back":"front";
                $("#card-direction option[value='"+direction+"']").prop("selected", "selected");
                $("#card-number option[value='"+cardSelected.data("number")+"']").prop("selected", "selected");
                $("#card-color option[value='"+cardSelected.data("color")+"']").prop("selected", "selected");
                $("#card-zindex").val(cardSelected.css("z-index"));

                var position = cardSelected.position();
                $("#card-left").val(position.left);
                $("#card-top").val(position.top);
            },

            updateUnderpanInspection:function() {
                // var cardSelected = $("#card-wrapper .card-selected");
                // var direction = cardSelected.hasClass("back")?"back":"front";
                // $("#card-direction option[value='"+direction+"']").prop("selected", "selected");
                // $("#card-number option[value='"+cardSelected.data("number")+"']").prop("selected", "selected");
                // $("#card-color option[value='"+cardSelected.data("color")+"']").prop("selected", "selected");
                // $("#card-zindex").val(cardSelected.css("z-index"));
                //
                // var position = cardSelected.position();
                // $("#card-left").val(position.left);
                // $("#card-top").val(position.top);
            },

            updateCardAttribute:function() {
                var cardSelected = $("#card-wrapper .card-selected");
                cardSelected.removeClass("back front").addClass($("#card-direction").val());

                var number = $("#card-number").val();
                cardSelected.data("number", number);
                $("p", cardSelected).html(number);

                cardSelected.removeClass(cardSelected.data("color"));
                var color = $("#card-color").val();
                cardSelected.data("color", color).addClass(color)
                cardSelected.css("z-index", $("#card-zindex").val());

                cardSelected.css("left",$("#card-left").val() + "px");
                cardSelected.css("top",$("#card-top").val() + "px");
            },
        },
        init: function () {
            $.fn.extend({
                 "updateCardInspection":function() {
                    $(".panel-inspection").hide();
                    $("#panel-card-inspection").show();
                    $("#card-wrapper .card.card-shadow").removeClass("card-shadow card-selected");
                    $(this).addClass("card-shadow card-selected");
                    Controller.api.updateCardInspection();
                },
                "updateUnderpanInspection":function() {
                    $(".panel-inspection").hide();
                    $("#panel-underpan-inspection").show();
                    $("#card-underpan .card.card-shadow").removeClass("card-shadow card-selected");
                    $(this).addClass("card-shadow card-selected");
                    Controller.api.updateUnderpanInspection();
                },
                "bindCard": function () {
                    $(this).draggable({
                        containment: "#containment-wrapper",
                        scroll: false,
                        snap: "#underpan-wrapper",
                        start:function( event, ui ) {
                            $(this).updateCardInspection();
                        },
                        drag: function( event, ui ) {
                            Controller.api.updateCardInspection();
                        }
                    });

                    $(this).on("click", function(){
                        $(this).updateCardInspection();
                    });

                    $(".card-remove", this).on("click", function(){
                        console.log("lskdf");
                    });
                }
            })
        }
    };
    Controller.api = $.extend(Poke.api, Controller.api);
    Controller.init();

    return Controller;
});