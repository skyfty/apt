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

            $("#card-name,#card-color,#card-direction,#card-zindex,#card-left,#card-top").on("change", function(){
                Controller.api.updateCardAttribute();
            });

            var setting = {
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    showRemoveBtn: function (treeId, treeNode) {
                        return treeNode.getParentNode() == null;
                    },
                    showRenameBtn: function(treeId, treeNode) {
                        return treeNode.getParentNode() == null;
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback:{
                    onClick:function(event, treeId, treeNode) {
                        $(".panel-inspection").hide();
                        if (typeof treeNode.rowid != "undefined") {
                            $("#panel-level-inspection").show();
                            $("#underpan-wrapper").html("");
                            $("#card-wrapper").html("");

                            var data = JSON.parse(treeNode.content);
                            for(var i in data){
                                var content = Template("tmpl-card",data[i]);
                                var ele = $("#underpan-wrapper").append(content);
                            }
                        }
                        $("#card-wrapper .card.card-shadow").removeClass("card-shadow card-selected");
                    },
                    beforeRemove: function (treeId, treeNode) {
                        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
                    },
                    onRemove: function (event, treeId, treeNode) {
                        Fast.api.ajax({
                            url: "index/del",
                            data: {id: treeNode.rowid}
                        });
                    },
                    beforeRename: function(treeId, treeNode, newName, isCancel) {
                        if (newName.length == 0) {
                            setTimeout(function() {
                                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                zTree.cancelEditName();
                                alert("节点名称不能为空.");
                            }, 0);
                            return false;
                        }
                        return true;
                    },
                    onRename: function (e, treeId, treeNode, isCancel) {
                        if (isCancel) return;
                        Fast.api.ajax({
                            url: "index/rename",
                            data: {id: treeNode.rowid, name:treeNode.name}
                        });
                    },

                    beforeDrag: function (treeId, treeNodes, targetNode, moveType) {
                        return targetNode.getParentNode() == null;
                    },
                    beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
                        return targetNode.getParentNode() == null;
                    }
                }
            };
            // zTree data attributes, refer to the API documentation (treeNode data details)
            var zNodes = [
            ];
            for(var i in levels) {
                var newNode = {
                    name:levels[i].name,
                    rowid:levels[i].id,
                    children:[
                        {
                            name:"台桌",
                            children:[
                            ]
                        },
                        {
                            name:"底牌",
                            children : []
                        }
                    ],
                    content:levels[i].content
                };
                zNodes.push(newNode);
            }
            var zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);

            var n1 = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
            var n2 = ["suitdiamonds","suithearts","suitclubs","suitspades"]

            $("#add-level").on("click", function(){
                var underpan_content = [];
                n1.forEach(function(v1){
                    n2.forEach(function(v2){
                        var content = {
                            name:v1,
                            color:v2
                        };
                        underpan_content.push(content);
                    });
                });

                var level_content = JSON.stringify(underpan_content);
                Fast.api.ajax({
                    url: "index/add",
                    data: {name: "新关卡", content:level_content}
                }, function (data, ret) {
                    var newNode = {
                        name:data.name,
                        rowid:data.id,
                        children:[
                            {
                                name:"台桌",
                                children:[
                                ]
                            },
                            {
                                name:"底牌",
                                children : []
                            }
                        ],
                        content:data.content
                    };
                    newNode = zTreeObj.addNodes(null, newNode);
                    return false;
                });
            });

            //
            // n1.forEach(function(v1){
            //     n2.forEach(function(v2){
            //         var content = Template("tmpl-card", {name: v1, color: v2});
            //         var ele = $("#underpan-wrapper").append(content);
            //     });
            // });

            $( "#underpan-wrapper .card" ).on("click", function(){
                $("#underpan-wrapper .card.card-shadow").removeClass("card-shadow card-selected");
                $(this).addClass("card-shadow card-selected").updateUnderpanInspection();
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
                $("#card-name option[value='"+cardSelected.data("name")+"']").prop("selected", "selected");
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
                // $("#card-name option[value='"+cardSelected.data("name")+"']").prop("selected", "selected");
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

                var name = $("#card-name").val();
                cardSelected.data("name", name);
                $("p", cardSelected).html(name);

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