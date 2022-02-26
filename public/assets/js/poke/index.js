define(['jquery', 'bootstrap', 'poke', 'ztree'], function ($, undefined, Poke, undefined) {
    var Controller = {
        index: function () {
            var underpan_wrapper = $( "#underpan-wrapper" );
            var card_wrapper = $( "#card-wrapper" );
            var panel_inspection = $( "#panel-inspection" );

            underpan_wrapper.sortable({
                stop: function( event, ui ) {//结束时触发
                    Controller.api.sync();
                }
            }).on("dblclick", function(){
                var ele = $(Template("tmpl-card", {})).appendTo(underpan_wrapper);
                ele.bindUnderpan();
                ele.addComponent("face", Controller.api.components.face.create(ele));
                ele.updateComponent();
                ele.click();
                Controller.api.sync();
            });

            card_wrapper.on("dblclick", function(evt){
                var def = {
                    "zindex":10,
                    "left":Math.max(0, evt.offsetX),
                    "top":Math.max(0, evt.offsetY)
                };
                var ele = $(Template("tmpl-card", {})).appendTo(card_wrapper);
                ele.bindCard();
                ele.addComponent("face",Controller.api.components.face.create(ele, def));
                ele.addComponent("position",Controller.api.components.position.create(ele));
                ele.addComponent("direction",Controller.api.components.direction.create(ele));
                ele.updateComponent();
                ele.click();
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
                        if (typeof treeNode.rowid != "undefined") {
                            underpan_wrapper.html("");
                            card_wrapper.html("");
                            panel_inspection.html("");

                            var underpans = treeNode.content.underpans;
                            for(const  i in underpans){
                                const components = underpans[i];
                                var ele = $(Template("tmpl-card", {})).appendTo(underpan_wrapper);
                                ele.bindUnderpan();
                                for(const c in components) {
                                    ele.addComponent(c,Controller.api.components[c].create(ele, components[c]));
                                }
                                ele.updateComponent();
                            }

                            var cards = treeNode.content.cards;
                            for(const  i in cards){
                                const components = underpans[i];
                                var ele = $(Template("tmpl-card", {})).appendTo(card_wrapper);
                                ele.bindCard();
                                for(const c in components) {
                                    ele.addComponent(c,Controller.api.components[c].create(ele, components[c]));
                                }
                                ele.updateComponent();
                            }
                            card_wrapper.scrollTop();
                            card_wrapper.scrollLeft();
                        }
                        $(".card.card-shadow", card_wrapper).removeClass("card-shadow card-selected");
                    },
                    beforeRemove: function (treeId, treeNode) {
                        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
                    },
                    onRemove: function (event, treeId, treeNode) {
                        Fast.api.ajax({
                            url: "index/del",
                            data: {id: treeNode.rowid}
                        }, function (data, ret) {
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
                $(".card-selected", card_wrapper).remove();
                Controller.api.sync();
            });
            $("#btn-underpan-delete").on("click", function(){
                $(".card-selected", underpan_wrapper).remove();
                Controller.api.sync();
            });

            window.onresize = function(){
                $("#card-contenter").css({width:underpan_wrapper.css("width")});
            };
            window.onresize();
        },

        api: {
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

            collectComponentData:function() {
                var data = {};
                var componentMap = $(this).getComponentMap();
                for(const i in componentMap) {
                    data[i] = componentMap[i].getData();
                }
                return data;
            },

            push:function() {
                var cards = [];
                $("#card-wrapper .card").each(function(){
                    cards.push(Controller.api.collectComponentData.apply(this));
                });
                var underpans=[];
                $("#underpan-wrapper .card").each(function(){
                    underpans.push(Controller.api.collectComponentData.apply(this));
                });

                var nodes = Controller.zTreeObj.getSelectedNodes();
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

            syncTimeoutId:0,
            sync:function() {
                clearTimeout(this.syncTimeoutId);
                this.syncTimeoutId = setTimeout(this.push, 3000);
            },

            components: {
                face:{
                    create:function(target, def) {
                        return {
                            data: $.extend({
                                name:"A",
                                color:"suitdiamonds",
                            }, def),
                            inspection:null,
                            target:target,

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-face", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },

                            onUpdateInspection:function() {
                                $("#card-name option[value='" + this.data.name+"']", this.inspection).prop("selected", "selected");
                                $("#card-color option[value='" + this.data.color+"']", this.inspection).prop("selected", "selected");
                            },

                            onInspectionChanged: function (input) {
                                var input_id = $(input).attr("id");
                                switch (input_id) {
                                    case "card-name": {
                                        this.data.name = $(input).val();
                                        break;
                                    }
                                    case "card-color": {
                                        this.data.color = $(input).val();
                                        break;
                                    }
                                }
                                this.onUpdate();
                            },

                            onUpdate:function() {
                                $("p", target).html(this.data.name);
                                target.removeClass("*suit");
                                target.addClass(this.data.color)
                            },

                            getData:function() {
                                return this.data;
                            }
                        };
                    }
                },
                direction:{
                    create:function(target, def) {
                        return {
                            direction:def || "front",
                            inspection:null,
                            target:target,

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-direction", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },

                            onUpdateInspection:function() {
                                $("#card-direction option[value='"+this.direction+"']", this.inspection).prop("selected", "selected");
                            },

                            onInspectionChanged: function (input) {
                                var input_id = $(input).attr("id");
                                switch (input_id) {
                                    case "card-direction": {
                                        this.direction = $(input).val();
                                        break;
                                    }
                                }
                                this.onUpdate();
                            },

                            onUpdate:function() {
                                target.removeClass("back front");
                                target.addClass(this.direction)
                            },

                            getData:function() {
                                return this.direction;
                            }

                        };
                    }
                },

                position: {
                    create:function(target, def) {
                        return {
                            left:def.left,
                            top:def.top,
                            zindex:def.zindex,
                            inspection:null,
                            target:target,

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-position", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },

                            onUpdateInspection:function() {
                                $("#card-zindex", this.inspection).val(this.target.css("z-index"));
                                var position =  this.target.position();
                                $("#card-left", this.inspection).val(position.left);
                                $("#card-top", this.inspection).val(position.top);
                            },

                            onInspectionChanged: function (input) {
                                var input_id = $(input).attr("id");
                                switch (input_id) {
                                    case "card-left": {
                                        this.left =  $(input).val();
                                        break;
                                    }
                                    case "card-top": {
                                        this.top =  $(input).val();
                                        break;
                                    }
                                    case "card-zindex": {
                                        this.zindex =  $(input).val();
                                        break;
                                    }
                                }
                                this.onUpdate();
                            },

                            onUpdate:function() {
                                this.target.css("left", this.left);
                                this.target.css("top", this.top);
                                this.target.css("z-index", this.zindex);
                            },

                            getData:function() {
                                var position =  this.target.position();
                                return {
                                    left:position.left,
                                    top:position.top,
                                    zindex:this.target.css("z-index"),
                                };
                            }
                        };
                    }
                },
            }
        },
        init: function () {
            $.fn.extend({
                getComponentMap:function() {
                    var componentMap = $(this).data("ComponentMap");
                    if (typeof componentMap === "undefined") {
                        componentMap = [];
                        $(this).data("ComponentMap", componentMap);
                    }
                    return componentMap;
                },
                addComponent:function(name, comp) {
                    $(this).getComponentMap()[name] = comp;
                 },

                updateComponent:function() {
                    var componentMap = $(this).getComponentMap();
                    for(const idx in componentMap) {
                        componentMap[idx].onUpdate()
                    }
                },

                updateInspection:function() {
                    var panel_inspection = $("#panel-inspection");
                    panel_inspection.html("");

                    var componentMap = $(this).getComponentMap();
                    for(const idx in componentMap) {
                        panel_inspection.append(componentMap[idx].getInspection());
                    }
                    for(const idx in componentMap) {
                        componentMap[idx].onUpdateInspection();
                    }
                },

                bindAttrInput:function(callback, component) {
                    $(".attr-input-card", this).on("change", function(env){
                        callback.call(component, this);
                        Controller.api.sync();
                    });
                },

                bindUnderpan: function () {
                    $(this).on("click", function(){
                        $(".card.card-shadow").removeClass("card-shadow card-selected");
                        $(this).addClass("card-shadow card-selected");
                        $(this).updateInspection();
                    });
                    return $(this);
                },

                bindCard: function () {
                    $(this).draggable({
                        opacity:true,
                        scroll: false,
                        containment: "#containment-wrapper",
                        start:function( event, ui ) {
                            $(this).getComponentMap()["position"].onUpdateInspection();
                        },
                        drag: function( event, ui ) {
                            $(this).getComponentMap()["position"].onUpdateInspection();
                        },
                        stop: function( event, ui ) {
                            Controller.api.sync();
                        }
                    });
                    $(this).on("click", function(ent){
                        $(".card.card-shadow").removeClass("card-shadow card-selected");
                        $(this).addClass("card-shadow card-selected");
                        $(this).updateInspection();
                    });
                    return $(this);
                }
            })
        }
    };
    Controller.api = $.extend(Poke.api, Controller.api);
    Controller.init();

    return Controller;
});