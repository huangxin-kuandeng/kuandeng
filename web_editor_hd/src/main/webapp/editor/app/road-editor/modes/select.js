/**
 * 
 * @param {Object} context
 * @param {Object} selectedIDs
 * @param {Object} transportation
 * @param {Boolean} fromManual 是否为手动通过context.enter调用
 */
iD.modes.Select = function (context, selectedIDs, transportation, fromManual) {
    var mode = {
        id: 'select',
        button: 'browse'
    };

    var keybinding = d3.keybinding('select'),
        timeout = null,
        behaviors = [
            iD.behavior.Hover(context),
            iD.behavior.Select(context),
            iD.behavior.Lasso(context),
            iD.modes.DragNode(context)
                .selectedIDs(selectedIDs)
                .behavior],
        inspector,
        radialMenu,
        newFeature = false,
        suppressMenu = false;

    var wrap = context.container()
        .select('.KDSEditor-inspector-wrap');

    function singular() {
        if (selectedIDs.length === 1) {
            // 切换任务时，偶尔会出现残留上个任务中选中的id
            //          return context.entity(selectedIDs[0]);
            var d = context.hasEntity(selectedIDs[0]);
            if (!d) {
                selectedIDs = [];
            }
            return d;
        }
    }

    /**
     * @param pathCenter:强制取选区的中心位置为菜单中心位置。
     */
    function positionMenu(pathCenter) {
        if (!radialMenu) {
            return;
        }
        var isLasso = d3.event &&
            d3.event._isLasso,
            posLoc = null;

        //从列表中点击进来的
        var isFromList = d3.event &&
            d3.event._isFromList;
        //在地图中点击道路
        var clickselect = d3.event &&
            d3.event._clickselect;
        //在左边sildebar，多选编辑道路属性
        var multiEditRoad = d3.event && d3.event._multiEditRoadProp
        var entity = singular();

        if ((isLasso || isFromList || pathCenter) && !clickselect) {

            if (isLasso && d3.event._lassoCenter && !d3.event._lassoReverseSel) {

                posLoc = context.projection(d3.event._lassoCenter);

            } else if (selectedIDs.length > 0) {
                //console.log('selectedIDs',selectedIDs);
                var selExtent = iD.geo.Extent();
                var posIds = selectedIDs;
                if (isFromList) {
                    var selector = iD.util.entityRelationFooterHighlightSelector(entity, context);
                    var sids = selector.split(',');
                    if (!sids[0]) sids = [];
                    if (sids.length) {
                        posIds = [];
                    }
                    sids.forEach(function (id) {
                        posIds.push(id.replace('.', ''));
                    });
                }
                _.each(posIds, function (id) {
                    selExtent = selExtent.extend(context.entity(id).extent(context.graph()));
                });
                posLoc = context.projection(selExtent.center());
            }
        } else if (!clickselect && fromManual) {
            //console.log('selectedIDs',selectedIDs);
            var selExtent = iD.geo.Extent();

            _.each(selectedIDs, function (id) {
                selExtent = selExtent.extend(context.entity(id).extent(context.graph()));
            });

            posLoc = context.projection(selExtent.center());
        }
        if (multiEditRoad) {
            var roadExtent = entity.extent(context.graph());
            posLoc = context.projection(roadExtent.center());
        }


        if (entity && entity.type === 'node') {
            radialMenu.center(context.projection(entity.loc));
        } else {
            //索套优先 中心位置，单选优选鼠标位置。
            //console.warn('posLoc',posLoc,context.mouse());
            radialMenu.center(posLoc || context.mouse());
            //console.warn('posLoc',posLoc,context.mouse());
        }
    }

    function showMenu() {
        //if (isDrawCrossWay || !showMenuByselected()) return; //modify sxt
        if (isDrawCrossWay || !radialMenu) return;
        context.surface()
            .call(radialMenu.close)
            .call(radialMenu);
    }

    /**
    * 交通规则关系编辑
    * return 
    */
    function compareMember(members, transportation) {
        //组合一个可以比较的对象
        var objA = { 'from_road': '', 'node': '', 'to_road': '' };
        _(members).each(function (member) {
            objA[member.role] = member.id;
        });
        var objB = { 'from_road': transportation.fromwayId, 'node': transportation.nodeId, 'to_road': transportation.towayId };
        return _.isEqual(objA, objB);
    }

    var isDrawCrossWay = false;//绘制后不再显示工具箱

    function zLevel() {
        // var layers = iD.Layers, layer = layers.getCurrentEnableLayer(), ids = context.selectedIDs();
        var layers = iD.Layers, layer = layers.getLayer(), ids = context.selectedIDs();
        if (layer && layer.isRoad() && ids.length >= 3) {
            var entity = context.graph().entity(ids[0]), way1 = context.graph().entity(ids[1]), way2 = context.graph().entity(ids[2]);
            if (entity.isRoadZLevel && entity.isRoadZLevel()) {
                var scmember = [{ type: 'Highway', role: 'link_up', id: way1.id }, { type: 'Highway', role: 'link_down', id: way2.id }];
                context.perform(iD.actions.ChangeNodeMember(entity.id, scmember), t('operations.change_members.annotation'));

                iD.util.storeDottedLoc(entity, way1, entity.id + '-' + way1.id, context.temp().zlevel_locs, context);
                iD.util.storeDottedLoc(entity, way2, entity.id + '-' + way2.id, context.temp().zlevel_locs, context);

                isDrawCrossWay = true;
            }
        }
    }

    mode.selectedIDs = function () {
        return selectedIDs;
    };
    mode.setSelectedIDs = function (_) {
        if (_) {
            selectedIDs = _;
        }
        return selectedIDs;
    };
    mode.closeRadialMenu = function () {
        if (radialMenu) {
            radialMenu.close();
            keybinding.off();
        }
    }

    mode.reselect = function () {
        var surfaceNode = context.surface().node();
        if (surfaceNode.focus) { // FF doesn't support it
            surfaceNode.focus();
        }

        positionMenu();
        showMenu();
    };

    mode.newFeature = function (_) {
        if (!arguments.length) return newFeature;
        newFeature = _;
        return mode;
    };

    mode.suppressMenu = function (_) {
        if (!arguments.length) return suppressMenu;
        suppressMenu = _;
        return mode;
    };

    mode.getLayerId = function () {
        let layerId;
        for (let i = 0; i < selectedIDs.length; i++) {
            var entityId = selectedIDs[i];
            var entity = context.entity(entityId);
            if (!layerId) {
                layerId = entity.layerId;
            }/* else if (layerId != entity.layerId){
                return null;
            }*/
        }
        return layerId;
    }

    mode.enter = function () {
        var isFromList = d3.event &&
            d3.event._isFromList;
        var outTaskBounds = false;
        if (context.transactionEditor()) {
            for (var _sid of selectedIDs) {
                var _et = context.entity(_sid);
                if (!iD.util.entityInPlyGon(_et, context) && _et.modelName !== iD.data.DataType.AUTO_CHECKWORK_TAG) {
                    outTaskBounds = true;
                }
            }
        }

        var $sidebar = d3.select("#KDSEditor-sidebar");
        var dataMultids = ($sidebar.attr("data-multiselectIDs") || '').split(',');
        if (!dataMultids[0]) dataMultids = [];
        if ((isFromList || dataMultids.length) && selectedIDs.length == 1) {
            // 单选时，若选中的要素不属于搜索定位的要素，清空参数
            var mids = ($sidebar.attr("data-member-multiselectids") || '').split(',');
            if (!mids[0]) mids = [];

            if (!_.include(mids, selectedIDs[0]) && !_.include(dataMultids, selectedIDs[0])) {
                $sidebar
                    .attr("data-multiselectIDs", null)
                    .attr("data-filterparam", null)
                    .attr("data-member-multiselectids", null);
                if (d3.event) {
                    d3.event._isFromList = false;
                }
                isFromList = false;
            } else {
                if (d3.event) {
                    d3.event._isFromList = true;
                }
                isFromList = true;
            }
        }

        // ----------  traffic logic start ----------
        var transp = context.transportation.is(selectedIDs[0]);
        context.transportation.reset(transp);
        // ----------  traffic logic end ----------
        /*        if(context.roadCrossEdit())
                {
                    roadCrossLine();//更新复杂路口关联线
                }*/

        // speedCamera();//电子眼关联道路

        zLevel();//zLevel关联道路

        behaviors.forEach(function (behavior) {
            context.install(behavior);
        });

        // var cLayer = context.layers().getCurrentEnableLayer();
        var layerId = this.getLayerId();
        var cLayer = layerId && iD.Layers.getLayer(layerId);
        var onlyIntersection = selectedIntersection();

        //      if (!layerId) {
        if (!showFilter()) {
            selectElements();
            context.event.selected(_.map(context.selectedIDs(), context.entity));
            updateFromListDom(isFromList);
            return false;
        }

        var onlyOperationKeys;
        if (onlyIntersection) {
            onlyOperationKeys = [];
            onlyOperationKeys.push('Delete');
            if (window._systemType == 8 || window._systemType == 9) {
                onlyOperationKeys.push('trackPointHeightDiff');
                onlyOperationKeys.push('trackControlPoint');
            }
        } else if (window._systemType == 9) {
            onlyOperationKeys = [];
        }

        function showFilter() {
            // 20190520 前方交会可弹出删除菜单
            if (onlyIntersection) return true;
            if (!layerId || !cLayer) return false;
            return true;
        }

        function selectedIntersection() {
            let ets = [];
            selectedIDs.forEach(function (sid) {
                let et = context.entity(sid);
                if (!et || !et.isPlaceName || !et.isSearchPoint) return;

                if (et.isPlaceName() || et.isSearchPoint()) {
                    ets.push(et);
                } else if (et.isSearchPoint && et.isSearchPoint()) {
                    ets.push(et);
                }
            });
            if (ets.length == selectedIDs.length) {
                return true;
            }
            return false;
        }

        var filterOperations = iD.operations;
        if (onlyOperationKeys != null) {
            filterOperations = {};
            for (let k of onlyOperationKeys) {
                if (iD.operations[k]) {
                    filterOperations[k] = iD.operations[k];
                }
            }
        }

        var operations = d3.values(filterOperations)
            // var operations = _.without(d3.values(filterOperations), iD.operations.Delete)
            // var operations = _.without(d3.values(iD.operations), iD.operations.Delete)
            .map(function (o) { return showFilter() && o(selectedIDs, context); })
            .filter(function (o) {
                // 事务范围判断
                if (!onlyIntersection && outTaskBounds) return false;
                // try{
                return showFilter() && o.available();
                // }catch(e){
                // console.warn(e);
                // return false;
                // }
            });
        // var opDelete = iD.operations.Delete(selectedIDs, context);
        // if(opDelete.available()){
        //     operations.unshift(iD.operations.Delete(selectedIDs, context));
        // }

        keybinding.on('⎋', function () {
            context.enter(iD.modes.Browse(context));
        }, true);

        operations.forEach(function (operation) {
            operation.keys.forEach(function (key) {
                keybinding.on(key, function () {
                    if (!operation.disabled()) {
                        operation();
                        //线路打断后, 工具箱刷新
                        // if (key === 'D') context.enter(iD.modes.Select(context, selectedIDs));
                    }
                });
            });
        });
        var _e = singular();
        context.ui().sidebar
            .select(_e ? _e.id : null, newFeature);

        context.history()
            .on('undone.select', update)
            .on('redone.select', update);

        function update() {
            context.surface().call(radialMenu.close);

            if (_.any(selectedIDs, function (id) { return !context.hasEntity(id); })) {
                // Exit mode if selected entity gets undone
                context.enter(iD.modes.Browse(context));
            }
        }
        // var repositionMenu = _.debounce(function(){
        //     if(d3.select('g.radial-menu').length>0 && d3.select('g.radial-menu')[0][0]!=null){
        //         //if(!context.map().hasTransformed()){
        //             //console.warn(d3.event);
        //             positionMenu(true);//移动或缩放时重新计算菜单位置
        //             //context.surface().call(radialMenu.close);
        //         //}
        //     }
        // },100);
        var repositionMenu = function () {
            if (d3.select('g.radial-menu').size() > 0) {

                positionMenu(true);//移动或缩放时重新计算菜单位置
            }
        }
        //context.map().on('drawn.select-rp',repositionMenu);
        context.map().on('moveend.select-rp', repositionMenu);
        context.map().on('zoom.select-rp', repositionMenu);
        d3.select(window).on('mousewheel.select-rp', repositionMenu);
        d3.select('button.zoom-in').on('mousewheel.select-rp', repositionMenu);
        d3.select('button.zoom-out').on('mousewheel.select-rp', repositionMenu);
        d3.select(window).on('resize.select-rp', repositionMenu);


        function dblclick() {
            //未开始任务的时候双击不添加形状点
            if (!(d3.select("body").attr("role") == "work" && iD.Task.working && iD.Task.working.task_id == iD.Task.d.task_id))
                return false;
            // var currLayer = context.layers().getCurrentEnableLayer();
            var target = d3.select(d3.event.target),
            datum = target.datum();
            let layer = iD.Layers.getLayer(datum.layerId);
            if (!datum || !layer.editable) {
                return false;
            }
            // if(!iD.Static.layersInfo.isEditable(datum.tags?datum.modelName:false))
            // {
            //     return false;
            // }
            if (datum instanceof iD.Way && !target.classed('fill')) {

                if (datum.isOneRoadCrossWay()) {
                    return false;
                }
                var firstNode = context.graph().childNodes(datum)[0];
                //              if(firstNode.modelName && context.variable.canNotDrag.includes(firstNode.modelName)){
                if (firstNode.modelName != iD.data.DataType.ROAD_NODE) {
                    return false;
                }
                //选择距离当前鼠标点最近的垂直投射距离
                var choice = iD.geo.chooseEdge(context.childNodes(datum), context.mouse(), context.projection),
                    node = iD.Node({
                        layerId: firstNode.layerId,
                        identifier: layer.identifier,
                        modelName: firstNode.modelName,
                        tags: iD.util.getDefauteTags(firstNode.modelName, iD.Layers.getLayer(firstNode.layerId))
                    });
                // node.modelName = firstNode.modelName;
                let xyz = iD.util.getPlyZ(context,choice.loc);
                if(xyz == null) return false;

                var prev = datum.nodes[choice.index - 1],
                    next = datum.nodes[choice.index];
                    choice.loc[2] = xyz;
                context.perform(
                    iD.actions.AddMidpoint({ loc: choice.loc, edge: [prev, next] }, node),
                    t('operations.add.annotation.vertex'));

                d3.event.preventDefault();
                d3.event.stopPropagation();
            }
        }

        d3.select(document)
            .call(keybinding);

        function selectElements() {
            var sids;
            //      	if(!fromManual){
            if (!isFromList) {
                sids = iD.util.entityOrMemberSelector(selectedIDs, context.graph());
            } else {
                sids = iD.util.entitySelector(selectedIDs);
            }
            context.surface()
                .selectAll(sids)
                .classed('selected', true);
            var slopesIds = [];
            for (var i = 0; i < selectedIDs.length; i++) {
                if (!context.hasEntity(selectedIDs[i])) {
                    continue;
                }
                if (context.entity(selectedIDs[i]) instanceof iD.Way && context.entity(selectedIDs[i]).tags && context.entity(selectedIDs[i]).modelName == iD.data.DataType.HIGHWAY) {

                    var slopes = context.entity(selectedIDs[i]).getSlopes(context.graph());

                    slopes.forEach(function (slope) {
                        slopesIds.push(slope.id);
                    })
                }
            }
            if (slopesIds.length > 0) {
                context.surface()
                    .selectAll(iD.util.entityOrMemberSelector(slopesIds, context.graph()))
                    .classed('selected', true);
            }

        }

        context.map().on('drawn.select', selectElements);
        selectElements();

        radialMenu = iD.ui.RadialMenu(context, transp ? [] : operations);
        var show = !suppressMenu;

        if (show) {
            positionMenu();
        }

        timeout = window.setTimeout(function () {
            if (show) {
                showMenu();
                // repositionMenu();
            }

            context.surface()
                .on('dblclick.select', dblclick);

            var sIDs = context.selectedIDs();
            sIDs && sIDs.forEach(function (id, i) {
                if (!context.graph().hasEntity(id)) {
                    sIDs.splice(i, 1);
                    context.surface().call(radialMenu.close);
                }
            });
        }, 200);
        var selecteds = [];
        selectedIDs.forEach(function (id) {
            selecteds.push(context.entity(id));
        });

        if (selectedIDs.length == 1) {
            iD.ui.dispEntity(context, context.graph().entity(selectedIDs[0]));
            if (isFromList) {
                iD.util.entityRelationFooterHighlightSelector(context.entity(selectedIDs[0]), context, true);
                if (d3.event) {
                    d3.event._isFromList = false;
                }
            }
        } else {
            iD.ui.dispMultiEntity(context, selectedIDs);
        }
        if (selectedIDs.length) {
            context.buriedStatistics().merge(1, selecteds[0].modelName, 1000);
        } else {
            let _name = context.buriedStatistics().getRecording().name;
            if (_name) {
                context.buriedStatistics().merge(0, _name);
            }
        }


        context.event.selected(selecteds);
        updateFromListDom(isFromList);
    };

    function updateFromListDom(isFromList) {
        if (selectedIDs.length > 1) {
            var entities = iD.ui.SelectionList(context, selectedIDs);
            d3.select("#KDSEditor-sidebar").attr("data-multiselectIDs", selectedIDs);
            context.ui().sidebar.show(entities);
        } else if (!isFromList) {
            // 单选时，非搜索定位，清空参数
            d3.select("#KDSEditor-sidebar")
                .attr("data-multiselectIDs", null)
                .attr("data-filterparam", null)
                .attr("data-member-multiselectids", null);
        }
    }

    mode.exit = function () {
        if (timeout) window.clearTimeout(timeout);

        if (inspector) wrap.call(inspector.close);

        behaviors.forEach(function (behavior) {
            context.uninstall(behavior);
        });

        keybinding.off();

        context.history()
            .on('undone.select', null)
            .on('redone.select', null);
        // 多选要素列表
        context.history().on('change.selection-list', null);

        var sf = context.surface();
        if (radialMenu) sf.call(radialMenu.close);
        sf.on('dblclick.select', null)
            .selectAll('.selected')
            .classed('selected', false);

        context.map().on('drawn.select', null);

        context.map().on('moveend.select-rp', null);
        context.map().on('zoom.select-rp', null);
        d3.select(window).on('mousewheel.select-rp', null);
        d3.select('button.zoom-in').on('mousewheel.select-rp', null);
        d3.select('button.zoom-out').on('mousewheel.select-rp', null);
        d3.select(window).on('resize.selec-rpt', null);

        context.ui().sidebar.hide();
    };

    return mode;
};







iD.modes.NewSelect = function (context, selectedIDs, _) {
    var mode = {
        id: 'select',
        button: 'browse'
    };

    var keybinding = d3.keybinding('select'),
        timeout = null,
        behaviors = [
            iD.behavior.Hover(context),
            iD.behavior.Select(context),
            iD.behavior.Lasso(context),
            iD.modes.DragNode(context)
                .selectedIDs(selectedIDs)
                .behavior],
        inspector,
        radialMenu,
        newFeature = false,
        suppressMenu = false;

    var wrap = context.container()
        .select('.KDSEditor-inspector-wrap');



    function positionMenu() {
        radialMenu.center(context.mouse());
    }

    function showMenu() {
        context.surface()
            .call(radialMenu.close)
            .call(radialMenu);
    }



    mode.selectedIDs = function () {
        return selectedIDs;
    };

    mode.reselect = function () {
        var surfaceNode = context.surface().node();
        if (surfaceNode.focus) { // FF doesn't support it
            surfaceNode.focus();
        }

        positionMenu();
        showMenu();
    };

    mode.newFeature = function (_) {
        if (!arguments.length) return newFeature;
        newFeature = _;
        return mode;
    };

    mode.suppressMenu = function (_) {
        if (!arguments.length) return suppressMenu;
        suppressMenu = _;
        return mode;
    };

    mode.enter = function () {


        behaviors.forEach(function (behavior) {
            context.install(behavior);
        });

        var operations = d3.values(iD.overoperations)
            .map(function (o) { return o(_, context); })
            .filter(function (o) { return o.available(); });


        keybinding.on('⎋', function () {
            context.enter(iD.modes.Browse(context));
        }, true);

        operations.forEach(function (operation) {
            operation.keys.forEach(function (key) {
                keybinding.on(key, function () {
                    if (!operation.disabled()) {
                        operation();
                    }
                });
            });
        });

        context.history()
            .on('undone.select', update)
            .on('redone.select', update);

        function update() {
            context.surface().call(radialMenu.close);

            if (_.any(selectedIDs, function (id) { return !context.hasEntity(id); })) {
                // Exit mode if selected entity gets undone
                context.enter(iD.modes.Browse(context));
            }
        }

        context.map().on('move.select', function () {
            context.surface().call(radialMenu.close);
        });



        d3.select(document)
            .call(keybinding);

        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .classed('selected', true);
        }

        context.map().on('drawn.select', selectElements);
        selectElements();

        radialMenu = iD.ui.RadialMenu(context, operations, true);
        var show = d3.event && !suppressMenu;

        if (show) {
            positionMenu();
        }

        timeout = window.setTimeout(function () {
            if (show) {
                showMenu();
            }

            var sIDs = context.selectedIDs();
            sIDs && sIDs.forEach(function (id, i) {
                if (!context.graph().hasEntity(id)) {
                    sIDs.splice(i, 1);
                    context.surface().call(radialMenu.close);
                }
            });
        }, 200);


    };

    mode.exit = function () {
        if (timeout) window.clearTimeout(timeout);

        if (inspector) wrap.call(inspector.close);

        behaviors.forEach(function (behavior) {
            context.uninstall(behavior);
        });

        keybinding.off();

        context.history()
            .on('undone.select', null)
            .on('redone.select', null);

        var sf = context.surface();
        if (radialMenu) sf.call(radialMenu.close);
        sf.on('dblclick.select', null)
            .selectAll('.selected')
            .classed('selected', false);

        context.map().on('drawn.select', null);

    };

    return mode;
};

