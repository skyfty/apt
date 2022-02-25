define(['jquery', 'bootstrap', 'poke', 'ztree'], function ($, undefined, Poke, undefined) {
    var Controller = {
        index: function () {
            $( "#underpan-wrapper" ).sortable({
                stop: function( event, ui ) {//结束时触发
                    Controller.api.sync();
                }
            }).on("dblclick", function(){
                var ele = $(Template("tmpl-card",Controller.api.defaultCard("underpan"))).appendTo(this);
                ele.bindUnderpan();
                ele.click();
            });

            $( "#card-wrapper" ).on("dblclick", function(evt){
                var def = {
                    left:Math.max(0, evt.offsetX),
                    top:Math.max(0, evt.offsetY)
                };
                var ele = $(Template("tmpl-card",Controller.api.defaultCard("card", def))).appendTo(this);
                ele.bindCard();
                ele.click();
            });

            $(".attr-input-card").on("change", function(){
                Controller.api.updateCardAttribute();
                Controller.api.sync();
            });


            $(".attr-input-underpan").on("change", function(){
                Controller.api.updateUnderpanAttribute();
                Controller.api.sync();
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

                check: {
                    enable: true,
                    nocheckInherit: true

                },
                view: {
                    showIcon: function(treeId, treeNode) {
                        return treeNode.isParent;
                    },
                    showLine: false,
                    selectedMulti: false
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
                            Controller.api.resetCardUnderpan();

                            var underpan_wrapper = $("#underpan-wrapper");
                            var underpans = treeNode.content.underpans;
                            for(var i in underpans){
                                $(Template("tmpl-card",underpans[i])).appendTo(underpan_wrapper).bindUnderpan();
                            }

                            var cards = treeNode.content.cards;
                            for(var i in cards){
                                $(Template("tmpl-card",cards[i])).appendTo("#card-wrapper").bindCard();
                            }
                            var card_wrapper = $("#card-wrapper");
                            card_wrapper.scrollTop();
                            card_wrapper.scrollLeft();
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
                        }, function (data, ret) {
                            Controller.api.resetCardUnderpan();
                            return false;
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

            var zNodes = [
            ];
            for(var i in levels) {
                var newNode = Controller.api.getNewLevelTree(levels[i].id, levels[i].name, JSON.parse(levels[i].content));
                zNodes.push(newNode);
            }
            Controller.zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);

            $("#add-level").on("click", function(){
                var level_content = JSON.stringify({"cards":[], "underpans":[]});
                Fast.api.ajax({
                    url: "index/add",
                    data: {name: "新关卡", content:level_content}
                }, function (data, ret) {
                    var newNode = Controller.api.getNewLevelTree(data.id, data.name, JSON.parse(data.content));
                    var treeNode = Controller.zTreeObj.addNodes(null, newNode);
                    document.getElementById(treeNode[0].tId+"_a").click();
                    return false;
                });
            });

            $("#downlaod-level").on("click", function(){
                var nodes = Controller.zTreeObj.getCheckedNodes(true);
                var ids = $.map(nodes, function(n, i){
                    return n.rowid;
                });
                var options = {
                    url: "index/download",
                    type: "POST",
                    dataType: "json",
                    data: {
                        ids: ids
                    },
                    success: function (ret) {
                        ret = Fast.events.onAjaxResponse(ret);
                        if (ret.code === 1) {
                            var ele = $("<a href='"+ret.url+"' target='_blank'>click</a>");
                            ele[0].click();
                        } else {
                            Fast.events.onAjaxError(ret);
                        }
                    },
                    error: function (xhr) {
                        var ret = {code: xhr.status, msg: xhr.statusText, data: null};
                        Fast.events.onAjaxError(ret);
                    }
                };
                $.ajax(options);
            });

            $("#btn-card-delete").on("click", function(){
                $("#card-wrapper .card-selected").remove();
                $(".panel-inspection").hide();
            });
            $("#btn-underpan-delete").on("click", function(){
                $("#underpan-wrapper .card-selected").remove();
                $(".panel-inspection").hide();
            });

            window.onresize = function(){
                $("#card-contenter").css({width:$("#underpan-wrapper").css("width")});
            };
            window.onresize();


        },

        api: {
            resetCardUnderpan:function() {
                var underpan_wrapper = $("#underpan-wrapper");
                underpan_wrapper.html("");
                var card_wrapper = $("#card-wrapper");
                card_wrapper.html("");
            },

            getNewLevelTree:function(id, name, cards) {
                var newNode = {
                    name:name,
                    rowid:id,
                    checked:false,
                    children:[
                        {
                            name:"台桌",
                            nocheck:true,
                            children:[]
                        },
                        {
                            name:"底牌",
                            nocheck:true,
                            children : []
                        }
                    ],
                    content : cards
                };
                return newNode;
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
                var cardSelected = $("#underpan-wrapper .card-selected");
                $("#underpan-name option[value='"+cardSelected.data("name")+"']").prop("selected", "selected");
                $("#underpan-color option[value='"+cardSelected.data("color")+"']").prop("selected", "selected");
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

            updateUnderpanAttribute:function() {
                var cardSelected = $("#underpan-wrapper .card-selected");
                var name = $("#underpan-name").val();
                cardSelected.data("name", name);
                $("p", cardSelected).html(name);
                cardSelected.removeClass(cardSelected.data("color"));
                var color = $("#underpan-color").val();
                cardSelected.data("color", color).addClass(color)
            },
            push:function() {
                var nodes = Controller.zTreeObj.getSelectedNodes();
                var cards = [];
                $("#card-wrapper .card").each(function(i, e){
                    var ele = $(e);
                    var data = {};
                    data['direction'] = ele.hasClass("back")?"back":"front";
                    var position = ele.position();
                    data['left'] = position.left;
                    data['top'] = position.top;
                    data['zindex'] = ele.css("z-index");
                    data['name'] = ele.data("name");
                    data['color'] = ele.data("color");
                    cards.push(data);
                });

                var underpans = [];
                $("#underpan-wrapper .card").each(function(i, e){
                    var ele = $(e);
                    var data = {};
                    data['left'] = "";
                    data['top'] = "";
                    data['direction'] = "front";
                    data['zindex'] = ele.css("z-index");
                    data['name'] = ele.data("name");
                    data['color'] = ele.data("color");
                    underpans.push(data);
                });

                var options = {
                    url: "index/update",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: nodes[0].rowid,
                        content:JSON.stringify({
                            cards:cards,
                            underpans:underpans
                        })
                    },
                    success: function (ret) {
                        ret = Fast.events.onAjaxResponse(ret);
                        if (ret.code === 1) {
                            nodes[0].content = JSON.parse(ret.data);
                            Controller.zTreeObj.updateNode(nodes[0]);
                        } else {
                            Fast.events.onAjaxError(ret);
                        }
                    },
                    error: function (xhr) {
                        var ret = {code: xhr.status, msg: xhr.statusText, data: null};
                        Fast.events.onAjaxError(ret);
                    }
                };
                $.ajax(options);
            },

            defaultCard:function(type, def) {
                switch (type) {
                    case "card": {
                        return $.extend({
                            name:"A",
                            color:"suitdiamonds",
                            type:type
                        }, def);
                    }
                    case "underpan": {
                        return  $.extend({
                            name:"A",
                            color:"suitdiamonds",
                            type:type
                        }, def);
                    }
                }
            },

            syncTimeoutId:0,
            sync:function() {
                clearTimeout(this.syncTimeoutId);
                this.syncTimeoutId = setTimeout(this.push, 1000);
            }
        },
        init: function () {
            $.fn.extend({
                 "updateCardInspection":function() {
                    $(".panel-inspection").hide();
                    $("#panel-card-inspection").show();
                    $(".card.card-shadow").removeClass("card-shadow card-selected");
                    $(this).addClass("card-shadow card-selected");
                    Controller.api.updateCardInspection();
                },
                "updateUnderpanInspection":function() {
                    $(".panel-inspection").hide();
                    $("#panel-underpan-inspection").show();
                    $(".card.card-shadow").removeClass("card-shadow card-selected");
                    $(this).addClass("card-shadow card-selected");
                    Controller.api.updateUnderpanInspection();
                },

                "bindUnderpan": function () {
                    $(this).on("click", function(){
                        $(this).updateUnderpanInspection();
                    });
                },

                "bindCard": function () {
                    $(this).draggable({
                        opacity:true,
                        scroll: false,
                        containment: "#containment-wrapper",
                        start:function( event, ui ) {
                            $(this).updateCardInspection();
                        },
                        drag: function( event, ui ) {
                            Controller.api.updateCardInspection();
                        },
                        stop: function( event, ui ) {
                            Controller.api.sync();
                        }
                    });

                    $(this).on("click", function(){
                        $(this).updateCardInspection();
                    });
                }
            })
        }
    };
    Controller.api = $.extend(Poke.api, Controller.api);
    Controller.init();

    return Controller;
});