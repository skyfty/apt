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
                stop: function() {//结束时触发
                    Controller.api.sync(true);
                }
            }).on("dblclick", function(){
                var node = $("#tree-level").tree('getSelected');
                if (node == null || node.type === "bag") {
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
                if (node == null || node.type === "bag") {
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

            });

            let nodes = [];
            for(const i in pokebags) {
                let pokebag = pokebags[i];
                let bag = Controller.api.getNewBagTree(pokebag.id, pokebag.name, "closed", JSON.parse(pokebag.params))
                for(const j in pokebag.levels) {
                    let level = pokebag.levels[j];
                    let levelNode = Controller.api.getNewLevelTree(
                        level.id,
                        level.name,
                        JSON.parse(level.composition),
                        JSON.parse(level.params),
                        JSON.parse(level.stage),
                        JSON.parse(level.underpan),
                        "closed");
                    bag.children.push(levelNode);
                }
                nodes.push(bag);
            }
            $("#tree-level").tree({
                data:nodes,
                dnd:true,
                onContextMenu: function(e,node){
                    e.preventDefault();
                    $(this).tree('select', node.target);
                    $("#menu-tree-" + node.type).menu('show', {
                        left: e.pageX,
                        top: e.pageY
                    });
                },
                checkbox:function(node){
                    return false;
                },
                onBeforeDrag:function(node){
                    return node.type === "level";
                },

                onDragOver:function(target, source){
                    return source.type === "level";
                },
                onBeforeDrop:function(target,source,point){
                    return source.type === "level" && (point === "top" || point === "bottom");
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

                selectedLevelId:0,
                onClick: function(node){
                    $(".panel-inspection").hide();

                    if (node.type === "bag" || node.type === "level") {
                        Controller.api.resetStage();
                    } else if (node.type === "underpan" || node.type === "stage") {
                        if (node.id !== this.selectedLevelId) {
                            Controller.api.resetStage();
                        } else {
                            Controller.panel_inspection_component.resetInspection(true);
                        }
                    }
                    if (node.type === "underpan" || node.type === "stage" ||  node.type === "level") {
                        if (node.type === "level") {
                            Controller.api.updateStage(node);
                        } else if (node.id !== this.selectedLevelId) {
                            Controller.api.updateStage($(this).tree("getParent", node.target));
                        }
                        this.selectedLevelId = node.id;
                    }
                    var html = $(Template("tmpl-inspection-" + node.type, node.params || {}));
                    html.bindAttrInput(node.onInspectionChanged, node);
                    $(node.inspection).show().html(html);
                }
            });

            $("#menu-tree-level #edit-level-tree,#edit-bag-tree").on("click", function(){
                var node = $("#tree-level").tree('getSelected');
                $("#tree-level").tree('beginEdit',node.target);
            });
            $("#menu-tree-level #download-bag-tree").on("click", function(){
                var node = $("#tree-level").tree('getSelected');
                if (node != null && node.type === "bag") {
                    Controller.api.download([node.id], "bag/download");
                }
            });
            $("#menu-tree-level #download-level-tree").on("click", function(){
                var node = $("#tree-level").tree('getSelected');
                if (node != null && node.type === "level") {
                    Controller.api.download([node.id], "level/download");
                }
            });

            $("#menu-tree-level #remove-level-tree").on("click", function(){
                var node = $("#tree-level").tree('getSelected');
                if (node != null && node.type === "level") {
                    Controller.api.deleteTreeNode(node, "level/del");
                }
            });
            $("#menu-tree-bag #new-level-bag-tree").on("click", function(){
                var node = $("#tree-level").tree('getSelected');
                if (node != null && node.type === "bag") {
                    Controller.api.addLevel(node);
                }
            });

            $("#menu-tree-bag #remove-bag-tree").on("click", function(){
                var node = $("#tree-level").tree('getSelected');
                if (node != null && node.type === "bag") {
                    Controller.api.deleteTreeNode(node, "bag/del");
                }
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

            window.addEventListener('resize', function(event){
                $("window-login").window("center");
            });

            $("#btn-login").on("click", function(){
                let username = $("#username").val();
                let password = $("#password").val();
                Fast.api.ajax({
                    url: "/index/login",
                    data: {username: username,password: password}
                }, function (data, ret) {
                    window.location.assign(data.url);
                    return false;
                });
            });

            $("#btn-logout").on("click", function(){
                Fast.api.ajax({
                    url: "/index/logout",
                }, function (data, ret) {
                    window.location.assign(data.url);
                    return false;
                });
            });
        },

        api: {

            deleteTreeNode:function(node, url) {
                if (confirm("确认要删除吗") !== true) {
                    return;
                }
                Fast.api.ajax({
                    url: url,
                    data: {ids: [node.id]}
                }, function () {
                    Controller.api.resetStage();
                    $("#tree-level").tree('remove', node.target);
                    return false;
                });
            },
            resetStage:function() {
                Controller.panel_underpan.html("");
                Controller.panel_card.html("");
                Controller.panel_inspection_component.resetInspection(true);
            },

            updateStage:function(node) {
                require(['dragscroll', 'zoomooz'], function () {
                    Controller.contenter_card.dragscroll({
                        autoFadeBars: true,
                        scrollBars: false,
                        smoothness: 15,
                        mouseWheelVelocity: 2
                    });
                });

                for(const  i in node.composition.underpans){
                    const components = node.composition.underpans[i];
                    let ele = $(Template("tmpl-card", {})).appendTo(Controller.panel_underpan);
                    ele.bindUnderpan();
                    for(const c in components) {
                        ele.addComponent(c,Controller.api.components[c].create(ele, components[c]));
                    }
                    ele.updateComponent();
                }

                for(const i in node.composition.cards){
                    const components = node.composition.cards[i];
                    let ele = $(Template("tmpl-card", {})).appendTo(Controller.panel_card);
                    ele.bindCard();
                    for(const c in components) {
                        ele.addComponent(c,Controller.api.components[c].create(ele, components[c]));
                    }
                    ele.updateComponent();
                }
            },

            getNewLevelTree:function(id, name, composition, params, stage, underpan, state) {
                return {
                    text: name,
                    id: id,
                    type: "level",
                    state: state,
                    iconCls: "icon-add",
                    inspection: "#panel-inspection-level",
                    children: [
                        {
                            text: "台桌",
                            id: id,
                            iconCls: "icon-help",
                            children: [],
                            checkbox: false,
                            type: "stage",
                            inspection: "#panel-inspection-stage",
                            params:stage,
                            onInspectionChanged: function (inspection) {
                                console.log("lskdf");
                            }
                        },
                        {
                            text: "底牌",
                            id: id,
                            iconCls: "icon-help",
                            checkbox: false,
                            type: "underpan",
                            inspection: "#panel-inspection-underpan",
                            children: [],
                            params:underpan,
                            onInspectionChanged: function (inspection) {
                                console.log("lskdf");

                            }
                        }
                    ],
                    composition: composition,
                    params:params,
                    onInspectionChanged: function (inspection) {
                        Fast.api.ajax({
                            url: "level/params",
                            data: {id:this.id, params:JSON.stringify(this.params)}
                        }, function (data) {
                            return false;
                        });
                    }

                };
            },
            getNewBagTree:function(id, name, state, params) {
                return {
                    text: name,
                    id: id,
                    type: "bag",
                    state: state,
                    iconCls: "icon-add",
                    inspection: "#panel-inspection-bag",
                    children: [],
                    params: params,
                    onInspectionChanged: function (inspection) {
                        Fast.api.ajax({
                            url: "bag/params",
                            data: {id:this.id, params:JSON.stringify(this.params)}
                        }, function (data) {
                            return false;
                        });
                    }
                };
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

            addLevel:function(bag) {
                const composition = JSON.stringify({"cards":[], "underpans":[]});
                const defparams = JSON.stringify({});
                Fast.api.ajax({
                    url: "level/add",
                    data: {
                        pokebag_model_id:bag.id,
                        name: "新关卡",
                        composition:composition,
                        params:defparams,stage:defparams,underpan:defparams,
                    }
                }, function (data) {
                    var newNode = Controller.api.getNewLevelTree(
                        data.id,
                        data.name,
                        JSON.parse(data.composition),
                        JSON.parse(data.params),
                        JSON.parse(data.stage),
                        JSON.parse(data.underpan),
                        "opened");
                    $("#tree-level").tree('append', {
                        parent:bag.target,
                        data: [newNode]
                    });
                    return false;
                });
            },
            download:function(ids, url) {
                let options = {
                    url: url,
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
                    url: "level/del",
                    data: {ids: ids}
                }, function () {
                    Controller.api.resetStage();
                    $("#tree-level").tree('remove', node.target);
                    return false;
                });
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
                var node = $('#tree-level').tree('getSelected');
                if (node == null || node.type === "bag") {
                    return;
                }
                if(node.type !== "level") {
                    node = $('#tree-level').tree('getParent', node.target);
                }

                let cards = [];
                $("#panel-card .card").each(function(){
                    cards.push(Controller.api.collectComponentData.apply(this));
                });
                let underpans=[];
                $("#panel-underpan .card").each(function(){
                    underpans.push(Controller.api.collectComponentData.apply(this));
                });

                let options = {
                    url: "level/update",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: node.id,
                        composition:JSON.stringify({
                            cards:cards,
                            underpans:underpans
                        })
                    },
                    success: function (ret) {
                        ret = Fast.events.onAjaxResponse(ret);
                        if (ret.code === 1) {
                            node.composition = JSON.parse(ret.data);
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
                                Controller.api.sync(true);
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
                                Controller.api.sync(true);
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
                                Controller.api.sync(true);
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
                                Controller.api.sync(false);
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
                    $(".attr-input-card", this).on("change", function(){
                        callback.call(component, this);
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
                        onBeforeDrag:function() {
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
                        onStopDrag: function() {
                            Controller.api.sync(true);
                        }
                    }).on("dblclick", function(){
                        let component = $(this).getComponent("position");
                        let data = component.getData();
                        data.zindex++;
                        component.setData(data);
                        component.update();
                        return false;
                    }).on("click", function(){
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

                addBag:function() {
                    const params = JSON.stringify({});
                    Fast.api.ajax({
                        url: "bag/add",
                        data: {name: "新关卡包", params:params}
                    }, function (data) {
                        var newNode = Controller.api.getNewBagTree(data.id, data.name, JSON.parse(data.params));
                        $("#tree-level").tree('append', {
                            data: [newNode]
                        });
                        return false;
                    });
                },

            })
        }
    };
    Controller.api = $.extend(Poke.api, Controller.api);
    Controller.init();

    return Controller;
});