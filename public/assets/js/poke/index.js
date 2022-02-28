define(['jquery', 'bootstrap','poke', 'easyui'], function ($, undefined, Poke, undefined, undefined) {
    var Controller = {
        index: function () {
            Controller.panel_underpan = $( "#panel-underpan" );
            Controller.panel_card = $( "#panel-card" );
            Controller.panel_inspection_component = $( "#panel-inspection-component" );
            Controller.contenter_card = $("#contenter-card");

            Controller.panel_underpan.sortable({
                start:function( event, ui) {
                    $(ui.item).click();
                },
                stop: function( event, ui ) {//结束时触发
                    Controller.api.sync(true);
                }
            }).on("dblclick", function(){
                var node = $("#tree-level").tree('getSelected');
                if (node == null) {
                    return;
                }
                let ele = $(Template("tmpl-card", {})).appendTo(Controller.panel_underpan);
                ele.bindUnderpan();
                ele.addComponent("face", Controller.api.components.face.create(ele));
                ele.updateComponent();
                ele.click();
                Controller.api.sync(true);
            });

            Controller.contenter_card.on("dblclick", function(evt){
                var node = $("#tree-level").tree('getSelected');
                if (node == null) {
                    return;
                }
                let ele = $(Template("tmpl-card", {})).appendTo(Controller.panel_card);
                ele.bindCard();
                ele.addComponent("position",Controller.api.components.position.create(ele, {
                    "zindex":10,
                    "left":Math.max(0, evt.offsetX - 35),
                    "top":Math.max(0, evt.offsetY - 50)
                }));
                ele.addComponent("face",Controller.api.components.face.create(ele));
                ele.addComponent("direction",Controller.api.components.direction.create(ele));
                ele.updateComponent();
                ele.click();
                Controller.api.sync(true);
            });

            Controller.panel_card.on("mousewheel DOMMouseScroll", function(e){
                // var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1))||
                //     (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
                //
                // $(this).zoomTo({
                //     targetsize:1,
                //     duration:600,
                //     root: Controller.contenter_card,
                //     animationendcallback:function(){
                //         console.log("lskf");
                //     }
                // });
            });

            let nodes = [];
            for(const i in levels) {
                nodes.push(Controller.api.getNewLevelTree(levels[i].id, levels[i].name, JSON.parse(levels[i].content)));
            }
            $("#tree-level").tree({
                data:nodes,
                dnd:true,
                onContextMenu: function(e,node){
                    e.preventDefault();
                    if (typeof node.content !== "undefined") {
                        $(this).tree('select', node.target);
                        let ele = $("#menu-tree-level");
                        ele.menu('show', {
                            left: e.pageX,
                            top: e.pageY
                        });
                    }
                },
                checkbox:function(node){
                    return typeof node.content !== "undefined";
                },
                onBeforeDrag:function(node){
                    return typeof node.content !== "undefined";
                },
                onStopDrag:function(node){
                    return typeof node.content !== "undefined";
                },
                onDragOver:function(node){
                    return typeof node.content !== "undefined";
                },
                onBeforeEdit:function(node){
                    if (node.text.length == 0) {
                        setTimeout(function() {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            zTree.cancelEditName();
                            alert("节点名称不能为空.");
                        }, 0);
                        return false;
                    }
                    return true;
                },
                onClick: function(node){
                    $(".panel-inspection").hide();
                    $(node.inspection).show();

                    if (typeof node.content !== "undefined") {
                        Controller.api.resetStage();
                        require(['dragscroll', 'zoomooz'], function () {
                            Controller.contenter_card.dragscroll({
                                autoFadeBars: true,
                                scrollBars: false,
                                smoothness: 15,
                                mouseWheelVelocity: 2
                            });
                        });

                        for(const  i in node.content.underpans){
                            const components = node.content.underpans[i];
                            let ele = $(Template("tmpl-card", {})).appendTo(Controller.panel_underpan);
                            ele.bindUnderpan();
                            for(const c in components) {
                                ele.addComponent(c,Controller.api.components[c].create(ele, components[c]));
                            }
                            ele.updateComponent();
                        }

                        for(const i in node.content.cards){
                            const components = node.content.cards[i];
                            let ele = $(Template("tmpl-card", {})).appendTo(Controller.panel_card);
                            ele.bindCard();
                            for(const c in components) {
                                ele.addComponent(c,Controller.api.components[c].create(ele, components[c]));
                            }
                            ele.updateComponent();
                        }
                    }
                }
            });

            $("#menu-tree-level #edit-level-tree").on("click", function(){
                var node = $("#tree-level").tree('getSelected');
                $("#tree-level").tree('beginEdit',node.target);
            });
            $("#menu-tree-level #remove-level-tree").on("click", function(){
                if (confirm("确认要删除吗") !== true) {
                    return;
                }
                var node = $("#tree-level").tree('getSelected');
                Fast.api.ajax({
                    url: "index/del",
                    data: {id: node.id}
                }, function (data, ret) {
                    Controller.api.resetStage();
                    $("#tree-level").tree('remove', node.target);
                    return false;
                });
            });

            $("#btn-card-delete").on("click", function(){
                $(".card-selected").remove();
                Controller.panel_inspection_component.resetInspection(true);
                Controller.api.sync(true);
            });


            $('#btn-component-add').on('show.bs.dropdown', function () {
                $(".card-selected").onShowComponentMenu();
            });


            $('#btn-component-add .dropdown-menu li').on('click', function () {
                $(".card-selected").onAddComponent($(this).data("name"));
                Controller.api.sync(true);
            });

        },

        api: {
            resetStage:function() {
                Controller.panel_underpan.html("");
                Controller.panel_card.html("");
                Controller.panel_inspection_component.resetInspection(true);
            },
            getNewLevelTree:function(id, name, cards) {
                let newNode = {
                    text:name,
                    id:id,
                    state:"closed",
                    checkbox: true,
                    iconCls:"icon-add",
                    inspection:"#panel-inspection-level",
                    children:[
                        {
                            text:"台桌",
                            iconCls:"icon-help",
                            children:[],
                            checkbox:false,
                            inspection:"#panel-inspection-stage",
                        },
                        {
                            text:"底牌",
                            iconCls:"icon-help",
                            checkbox:false,
                            inspection:"#panel-inspection-underpan",
                            children : []
                        }
                    ],
                    content : cards
                };
                return newNode;
            },
            loadLevels: function (url, custom) {
                let deferred = $.Deferred();
                $.ajax({type: "GET", url:url,
                    data: custom
                }).then(function(ret){
                    if (ret && ret.rows && ret.rows.length > 0) {
                        deferred.resolve(ret);
                    }
                });
                return deferred.promise();
            },
            collectComponentData:function() {
                let data = {};
                const componentMap = $(this).getComponentMap();
                for(const i in componentMap) {
                    data[i] = componentMap[i].getData();
                }
                return data;
            },

            push:function() {
                let cards = [];
                $("#panel-card .card").each(function(){
                    cards.push(Controller.api.collectComponentData.apply(this));
                });
                let underpans=[];
                $("#panel-underpan .card").each(function(){
                    underpans.push(Controller.api.collectComponentData.apply(this));
                });

                var node = $('#tree-level').tree('getSelected');
                let options = {
                    url: "index/update",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: node.id,
                        content:JSON.stringify({
                            cards:cards,
                            underpans:underpans
                        })
                    },
                    success: function (ret) {
                        ret = Fast.events.onAjaxResponse(ret);
                        if (ret.code === 1) {
                            node.content = JSON.parse(ret.data);
                            $('#tree-level').tree("update", node);
                        } else {
                            Fast.events.onAjaxError(ret);
                        }
                    },
                    error: function (xhr) {
                        let ret = {code: xhr.status, msg: xhr.statusText, data: null};
                        Fast.events.onAjaxError(ret);
                    }
                };
                $.ajax(options);
            },

            syncTimeoutId:0,
            sync:function(now) {
                clearTimeout(this.syncTimeoutId);
                this.syncTimeoutId = setTimeout(this.push, now===true?0:3000);
            },

            components: {
                face:{
                    suits:{
                        'diamonds':'suitdiamonds',
                        'hearts':'suithearts',
                        'clubs':'suitclubs',
                        'spades':'suitspades',
                        'rand':'suitrand',
                        'wan':'suitwan'
                    },
                    containment: ["underpan", "card"],
                    create:function(target, def) {
                        return {
                            data: $.extend({
                                name:"A",
                                color:Controller.api.components.face.suits['spades'],
                            }, def),
                            onlyone:true,
                            inspection:null,
                            target:target,
                            primary:true,
                            repels:[],

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-face", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },
                            enable:function(v) {
                                $(".attr-input-card", this.inspection).prop('disabled', !v)
                            },

                            onUpdateInspection:function() {
                                $("#card-name option[value='" + this.data.name+"']", this.inspection).prop("selected", "selected");
                                $("#card-color option[value='" + this.data.color+"']", this.inspection).prop("selected", "selected");
                            },

                            onInspectionChanged: function (input) {
                                let input_id = $(input).attr("id");
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

                                let suitClass = [];
                                let suits = Controller.api.components.face.suits;
                                for(let i in suits) {
                                    suitClass.push(suits[i]);
                                }
                                target.removeClass(suitClass.join(" "));
                                target.addClass(this.data.color)
                            },

                            getData:function() {
                                return this.data;
                            },

                            setData:function(v) {
                                this.data = $.extend(this.data, v);
                            },

                            onRemove:function() {
                                this.inspection.removeInspectionPanel();
                            },

                            onAttach:function() {

                            },
                            update:function() {
                                this.onUpdate();
                                this.onUpdateInspection();
                            }
                        };
                    }
                },
                direction:{
                    containment: ["underpan", "card"],

                    create:function(target, def) {
                        return {
                            direction: def || "front",
                            inspection:null,
                            target:target,
                            onlyone:true,
                            repels:[],

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-direction", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },
                            enable:function(v) {
                                $(".attr-input-card", this.inspection).prop('disabled', !v)
                            },

                            onUpdateInspection:function() {
                                $("#card-direction option[value='"+this.direction+"']", this.inspection).prop("selected", "selected");
                            },

                            onInspectionChanged: function (input) {
                                let input_id = $(input).attr("id");
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
                            },

                            setData:function(v) {
                                this.direction = v;
                            },
                            onRemove:function() {
                                target.removeClass("back front");
                                this.inspection.removeInspectionPanel();
                            },

                            onAttach:function() {

                            },
                            update:function() {
                                this.onUpdate();
                                this.onUpdateInspection();
                            }
                        };
                    }
                },
                rand:{
                    containment: ["underpan", "card"],

                    create:function(target, def) {
                        return {
                            inspection:null,
                            target:target,
                            onlyone:true,
                            scope: def || "",
                            repels:['wan'],

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-rand", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },

                            enable:function(v) {
                                $(".attr-input-card", this.inspection).prop('disabled', !v)
                            },

                            onUpdateInspection:function() {
                                this.setFaceComponent(false);
                                $("#card-scope", this.inspection).val(this.scope);
                            },

                            setFaceComponent:function(v) {
                                let face_component = $(this.target).getComponent("face");
                                face_component.enable(v);
                                if (v) {
                                    face_component.setData({
                                        name:"A",
                                        color:Controller.api.components.face.suits['spades']
                                    });
                                } else {
                                    face_component.setData({
                                        name:"R",
                                        color:Controller.api.components.face.suits['rand']
                                    });
                                }
                                face_component.update();
                            },

                            onInspectionChanged: function (input) {
                                let input_id = $(input).attr("id");
                                switch (input_id) {
                                    case "card-scope": {
                                        this.scope = $(input).val();
                                        break;
                                    }
                                }
                                this.onUpdate();
                            },

                            onUpdate:function() {
                            },

                            getData:function() {
                                return this.scope;
                            },

                            setData:function(v) {
                                this.scope = v;
                            },
                            onRemove:function() {
                                this.inspection.removeInspectionPanel();
                                this.setFaceComponent(true);
                            },

                            onAttach:function() {
                                this.setFaceComponent(false);
                                for(const i in this.repels) {
                                    $(this.target).removeComponent(this.repels[i]);
                                }
                            },
                            update:function() {
                                this.onUpdate();
                                this.onUpdateInspection();
                            }
                        };
                    }
                },
                wan:{
                    containment: ["underpan", "card"],

                    create:function(target, def) {
                        return {
                            inspection:null,
                            target:target,
                            onlyone:true,
                            repels:['rand'],

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-wan", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },
                            enable:function(v) {

                            },

                            onUpdateInspection:function() {
                                this.setFaceComponent(false);
                            },

                            onInspectionChanged: function (input) {
                                this.onUpdate();
                            },
                            setFaceComponent:function(v) {
                                let face_component = $(this.target).getComponent("face");
                                face_component.enable(v);
                                if (v) {
                                    face_component.setData({
                                        name:"A",
                                        color:Controller.api.components.face.suits['spades']
                                    });
                                } else {
                                    face_component.setData({
                                        name:"W",
                                        color:Controller.api.components.face.suits['wan']
                                    });
                                }
                                face_component.update();
                            },

                            onUpdate:function() {
                            },

                            getData:function() {
                                return true;
                            },

                            setData:function(v) {

                            },
                            onRemove:function() {
                                this.inspection.removeInspectionPanel();
                                this.setFaceComponent(true);
                            },

                            onAttach:function() {
                                this.setFaceComponent(false);
                                for(const i in this.repels) {
                                    $(this.target).removeComponent(this.repels[i]);
                                }
                            },

                            update:function() {
                                this.onUpdate();
                                this.onUpdateInspection();
                            }
                        };
                    }
                },
                position: {
                    containment: ["card"],

                    create:function(target, def) {
                        return {
                            data:{
                                left:def.left,
                                top:def.top,
                                zindex:def.zindex
                            },
                            inspection:null,
                            target:target,
                            onlyone:true,
                            primary:true,
                            repels:[],

                            getInspection:function() {
                                this.inspection = $(Template("tmpl-component-card-position", this));
                                this.inspection.bindAttrInput(this.onInspectionChanged, this);
                                return this.inspection;
                            },
                            enable:function(v) {
                                $(".attr-input-card", this.inspection).prop('disabled', !v)
                            },

                            onUpdateInspection:function() {
                                $("#card-zindex", this.inspection).val(this.data.zindex = this.target.css("z-index"));
                                let position =  this.target.position();
                                $("#card-left", this.inspection).val(this.data.left =  position.left);
                                $("#card-top", this.inspection).val(this.data.top =  position.top);
                            },

                            onInspectionChanged: function (input) {
                                let input_id = $(input).attr("id");
                                switch (input_id) {
                                    case "card-left": {
                                        this.data.left =  $(input).val();
                                        break;
                                    }
                                    case "card-top": {
                                        this.data.top =  $(input).val();
                                        break;
                                    }
                                    case "card-zindex": {
                                        this.data.zindex =  $(input).val();
                                        break;
                                    }
                                }
                                this.onUpdate();
                            },

                            onUpdate:function() {
                                let style = {
                                    "left":this.data.left + "px",
                                    "top":this.data.top + "px",
                                    "z-index":this.data.zindex,
                                };
                                this.target.css(style);
                            },

                            getData:function() {
                                let position =  this.target.position();
                                return {
                                    left:position.left,
                                    top:position.top,
                                    zindex:this.target.css("z-index"),
                                };
                            },

                            setData:function(v) {
                                this.data = $.extend(this.data, v);
                            },

                            onRemove:function() {
                                this.inspection.removeInspectionPanel();

                            },

                            onAttach:function() {

                            },
                            update:function() {
                                this.onUpdate();
                                this.onUpdateInspection();
                            }
                        };
                    }
                },
            }
        },
        init: function () {
            $.fn.extend({
                getComponentMap:function() {
                    let componentMap = $(this).data("ComponentMap");
                    if (typeof componentMap === "undefined") {
                        componentMap = [];
                        $(this).data("ComponentMap", componentMap);
                    }
                    return componentMap;
                },
                addComponent:function(name, component) {
                    $(this).getComponentMap()[name] = component;
                    return component;
                },
                removeComponent:function(component) {
                    let componentMap = $(this).getComponentMap();
                    for(let idx in componentMap) {
                        if (typeof component === "string") {
                            var iss = idx === component;
                            if (iss) {
                                component = componentMap[idx];
                            }
                        } else {
                            var iss = componentMap[idx] === component;
                        }
                        if (iss) {
                            if (component.onRemove() !== false) {
                                delete componentMap[idx];
                            } else {
                            }
                            break;
                        }
                    }
                },
                updateComponent:function() {
                    let componentMap = $(this).getComponentMap();
                    for(const idx in componentMap) {
                        componentMap[idx].update()
                    }
                },

                getComponent:function(name) {
                    let componentMap = $(this).getComponentMap();
                    return componentMap[name] || null;
                },

                onShowComponentMenu:function() {
                    $("#btn-component-add .dropdown-menu li").show();

                    let panel_id = $(this).data("panel");
                    for(const i in Controller.api.components) {
                        const component = Controller.api.components[i];
                        if ($.inArray(panel_id, component.containment) === -1) {
                            $("#btn-component-add [data-name='"+i+"']").hide();
                        }
                    }

                    let componentMap = $(this).getComponentMap();
                    for(const i in componentMap) {
                        if (componentMap[i].onlyone) {
                            $("#btn-component-add [data-name='"+i+"']").hide();
                        }
                    }
                },

                onAddComponent:function (name) {
                    const ele = $(this);
                    let component = ele.addComponent(name, Controller.api.components[name].create(ele));
                    Controller.panel_inspection_component.addInspectionPanel(component);
                    component.onAttach();
                    ele.updateComponent();
                },

                updateInspection:function() {
                    Controller.panel_inspection_component.resetInspection();
                    let componentMap = $(this).getComponentMap();
                    for(const idx in componentMap) {
                        Controller.panel_inspection_component.addInspectionPanel(componentMap[idx]);
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
                        $(".panel-inspection").hide();
                        $("#panel-inspection-card").show();
                        $(".card.card-shadow").removeClass("card-shadow card-selected");
                        $(this).addClass("card-shadow card-selected");
                        $(this).updateInspection();
                    }).data("panel", "underpan");

                    return $(this);
                },

                bindCard: function () {
                    $(this).draggable({
                        onBeforeDrag:function(e) {
                            $(this).click();
                        },
                        onDrag: function(e) {
                            var d = e.data;
                            if (d.left < 0){d.left = 0}
                            if (d.top < 0){d.top = 0}
                            if (d.left + $(d.target).outerWidth() > $(d.parent).width()){
                                d.left = $(d.parent).width() - $(d.target).outerWidth();
                            }
                            if (d.top + $(d.target).outerHeight() > $(d.parent).height()){
                                d.top = $(d.parent).height() - $(d.target).outerHeight();
                            }
                            $(this).getComponent("position").onUpdateInspection();
                        },
                        onStopDrag: function(e) {
                            Controller.api.sync(true);
                        }
                    }).on("dblclick", function(e){
                        let component = $(this).getComponent("position");
                        let data = component.getData();
                        data.zindex++;
                        component.setData(data);
                        component.update();
                        return false;
                    }).on("click", function(ent){
                        $(".panel-inspection").hide();
                        $("#panel-inspection-card").show();

                        $(".card.card-shadow").removeClass("card-shadow card-selected");
                        $(this).addClass("card-shadow card-selected").updateInspection();
                    }).data("panel", "card");
                    return $(this);
                },

                shake:function() {
                    $(this).addClass('animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $(this).removeClass('shake');
                    });
                },
                resetInspection:function(whole) {
                    const panels = $(this).accordion("panels");
                    const panel_length = panels.length;
                    for(var idx  = 0; idx < panel_length; ++idx) {
                        $(this).accordion("remove", 0);
                    }
                    if (whole === true) {
                        $(".panel-inspection").hide();
                    }
                },

                removeInspectionPanel:function() {
                    let title = $(this).attr("title");
                    Controller.panel_inspection_component.accordion('remove',title);
                },

                addInspectionPanel:function(component, inspection) {
                    if (typeof inspection === "undefined") {
                        inspection = component.getInspection();
                    }
                    $(this).accordion('add', {
                        title: inspection.attr("title"),
                        content: inspection,
                        closable:!component.primary,
                        collapsed:false,collapsible:false,
                        onBeforeClose:function() {
                            return component.primary;
                        },
                        onClose:function() {
                            component.target.removeComponent(component);
                            Controller.api.sync();
                        }
                    });
                },

                addLevel:function() {
                    const level_content = JSON.stringify({"cards":[], "underpans":[]});
                    Fast.api.ajax({
                        url: "index/add",
                        data: {name: "新关卡", content:level_content}
                    }, function (data, ret) {
                        var newNode = Controller.api.getNewLevelTree(data.id, data.name, JSON.parse(data.content));
                        $("#tree-level").tree('append', {
                            data: [newNode]
                        });
                        return false;
                    });
                },

                downloadLevels:function() {
                    var nodes = $("#tree-level").tree('getChecked');	// get checked nodes
                    const ids = $.map(nodes, function(n, i){
                        return n.id;
                    });
                    let options = {
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
                            let ret = {code: xhr.status, msg: xhr.statusText, data: null};
                            Fast.events.onAjaxError(ret);
                        }
                    };
                    $.ajax(options);
                },
                deleteLevels:function() {
                    var nodes = $("#tree-level").tree('getChecked');	// get checked nodes
                    const ids = $.map(nodes, function(n, i){
                        return n.id;
                    });
                    Fast.api.ajax({
                        url: "index/del",
                        data: {ids: ids}
                    }, function (data, ret) {
                        Controller.api.resetStage();
                        $("#tree-level").tree('remove', node.target);
                        return false;
                    });
                }
            })
        }
    };
    Controller.api = $.extend(Poke.api, Controller.api);
    Controller.init();

    return Controller;
});