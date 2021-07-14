/*
 * @Author: tao.w
 * @Date: 2019-09-27 17:14:07
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-25 10:48:23
 * @Description: 
 */
/**
 * 拖拽节点，或虚拟节点
 * @param {Object} context
 * @param {Object} selectedWays
 */
iD.modes.DragNode = function (context, selectedWays) {
    var mode = {
        id: 'drag-node',
        button: 'browse'
    };
    var nudgeInterval,
        activeIDs,
        wasMidpoint,
        cancelled,
        startloc,
        selectedIDs = [],
        hover = iD.behavior.Hover(context)
            .altDisables(false)
            .on('hover', context.ui().sidebar.hover),
        edit = iD.behavior.Edit(context);

    var oldNodeEntity;

    function isOverlay(entity) {
        return _.filter([
            iD.Marker,
            iD.Icon,
            iD.Polygon,
            iD.Polyline
        ], Overlay => entity instanceof Overlay).length || entity.graphType != null;
    }

    function edge(point, size) {
        var pad = [30, 100, 30, 100];
        if (point[0] > size[0] - pad[0]) return [-10, 0];
        else if (point[0] < pad[2]) return [10, 0];
        else if (point[1] > size[1] - pad[1]) return [0, -10];
        else if (point[1] < pad[3]) return [0, 10];
        return null;
    }

    function startNudge(nudge) {
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = window.setInterval(function () {
            context.pan(nudge);
        }, 50);
    }

    function stopNudge() {
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = null;
    }

    function moveAnnotation(entity) {
        return t('operations.move.annotation.' + entity.geometry(context.graph()));
    }

    function connectAnnotation(entity) {
        if (newNodeEntity.length > 0) {
            return t('operations.topo_split.annotation-way');
        }
        return t('operations.connect.annotation.' + entity.geometry(context.graph()));
    }

    function origin(entity) {
        return context.projection(entity.loc);
    }

    /**
     * 图层是否可编辑
     */
    function layerEnable(entity) {
        var r = true;
        if (entity.type === 'midpoint') r = iD.Layers.getLayer(entity.parents[0].layerId);
        else r = iD.Layers.getLayer(entity.layerId);
        return r == null ? false : r.editable;
    }

	/**
	 * 判断该entity是否可拖拽
	 * @param {Object} entity
	 */
    function filter(entity) {
        var isoverlay = isOverlay(entity);
        // marker、polygon、poyline
        if (!isoverlay) {
            var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if (!(iD.Task.working && iD.Task.working.task_id === iD.Task.d.task_id) || (!modelConfig || !modelConfig.editable)) {
                return true;
            }
        }
        if (!isoverlay) {
            if (entity.modelName
                // && entity.modelName == iD.data.DataType.DIVIDER_NODE
                && iD.Task.hideNoMeasureOperate()) {
                // 禁止车道线拖拽
                return true;
            } else if (entity.modelName && context.variable.canNotDrag.includes(entity.modelName)) {
                return true;
            } else if (arguments[1] == 'start' || arguments[1] == 'ing') {
                return false;
            }
        }
        if (isoverlay && entity instanceof iD.Entity) {
            if (entity.g() && entity.g().g()) {
                // 支持编辑
                if (entity.enable || entity.editable) {
                    if (arguments[1] != 'start') {
                        entity.loc = context.map().mouseCoordinates();
                    }
                    if (entity.parents && entity.edge) //add polyline node
                    {
                        var nodes = entity.parents.nodes;
                        for (var i = 0; i < nodes.length - 1; i++) {
                            if (iD.geo.edgeEqual([nodes[i].id, nodes[i + 1].id], entity.edge)) {
                                nodes.splice(i + 1, 0, entity);
                                continue;
                            }
                        }
                    }
                    var k = 'drag' + arguments[1];
                    context.event[k] && context.event[k]({ overlay: entity, loc: entity.loc });
                    context.map().drawOverlayers();
                }
                return true;
            }
        }
        if (entity.type === iD.data.GeomType.MIDPOINT) {
            let edgeFirstId = entity.edge[0];
            let edgeFirstEntity = context.getEntity(edgeFirstId);
            return edgeFirstEntity.modelName && context.variable.canNotDrag.includes(entity.modelName) ? true : false;
        }

        if (!layerEnable(entity) || entity instanceof iD.Transportation) return true;
        //      if (entity instanceof iD.Node && (entity.isRoadCross() || entity.isPlaceName() || entity.isQcTag())) {
        if (entity instanceof iD.Node && (entity.isPlaceName() || entity.isQcTag())) {
            return true;
        }
        if (entity instanceof iD.Node && iD.util.entityInPlyGon(entity, context) && arguments[1] != 'end') return true;

    }

    function un_drag_mid_node(entity) {
        if (entity.type == 'midpoint') {
            var e2 = context.graph().entity(entity.edge[0]);
            var way2 = context.graph().parentWays(e2);
            if (way2.length && way2[0]._type == "roadcrossline") {
                return 1;
            }
        }
        return 0;
    }

    //判断待移动的结点是否被综合交叉点综合，如果被综合交叉点综合，并且只有两条道路则不能移除
    var willBeSingleNode = function (entity, context) {
        var flag = false;
        var topoEntity = iD.TopoEntity();
        var crossNodeId = topoEntity.isInCrossNode(context.graph(), entity.id);
        if (crossNodeId) {
            var parentWays = context.graph().parentWays(entity);
            var wayCounts = 0;
            for (var i = 0; i < parentWays.length; i++) {
                if (parentWays[i].modelName == iD.data.DataType.HIGHWAY)
                    wayCounts++;
            }
            if (wayCounts == 2) {
                //Dialog.alert("结点被综合交叉点综合，请先取消综合再进行拓补分离操作");
                flag = true;
            }
        }
        return flag;
    }

    //如果选中的结点是一个孤立的结点
    var isSingleNode = function (entity, context) {
        var flag = false;
        var parentWays = context.graph().parentWays(entity);
        var wayCounts = 0;
        for (var i = 0; i < parentWays.length; i++) {
            if (parentWays[i].modelName == iD.data.DataType.HIGHWAY)
                wayCounts++;
        }
        if (wayCounts == 1) {
            //Dialog.alert("结点被综合交叉点综合，请先取消综合再进行拓补分离操作");
            flag = true;
        }
        return flag;
    }


    var altPopFlag;

	/**
	 * 开始拖拽
	 * @param {Object} entity
	 * 拖拽虚拟节点：type为 midpoint，有edge属性（数组的两个nodeid），没有modelName
	 * 拖拽普通节点：就是普通的Node对象
	 */
    function start(entity) {
        altPopFlag = d3.event && d3.event.sourceEvent.altKey || false;
        if (filter(entity, 'start')) return;
        var flag = false;
        if (selectedWays && isSingleNode(entity, context)) {

        } else if (selectedWays) {
            //if(filterTopo(entity,'start')) return ;
            if (willBeSingleNode(entity, context)) {
                context.variable.singleNodeByTopoSplit = true;
                context.variable.singleNode = entity.id;
                context.enter(iD.modes.Browse(context));
                return;
                //return;
            } else {
                oldNodeEntity = entity;     //拓扑分离点实体
                context.perform(iD.actions.TopoSplit(context, selectedWays, entity, newNodeEntity));
                context.variable.firstInTopo = false;
                flag = true;
                if (newNodeEntity && newNodeEntity.length > 0) {
                    entity = newNodeEntity[0];
                    var vertex = context.surface()
                        .selectAll('.' + entity.id);
                    behavior.target(vertex.node(), entity);
                    dragWayBehavior && dragWayBehavior.target(vertex.node(), entity);
                }
            }
        }

        cancelled = d3.event.sourceEvent.shiftKey;
        if (cancelled) {
            dragWayBehavior && dragWayBehavior.cancel();
            return behavior.cancel();
        }

        wasMidpoint = entity.type === 'midpoint';
        if (wasMidpoint) {
            var midpoint = entity;
            var pEntity = entity.parents[0];

            let firstNode = context.entity(pEntity.first());
            let layer = iD.Layers.getLayer(pEntity.layerId);
            entity = iD.Node({
                identifier: layer.identifier,
                layerId: pEntity.layerId,
                modelName: firstNode.modelName
            });


            context.perform(iD.actions.AddMidpoint(midpoint, entity));

            var vertex = context.surface()
                .selectAll('.' + entity.id);
            behavior.target(vertex.node(), entity);
            context.event['entityedite'] && context.event['entityedite']({
                entitys: _.pluck(context.history().graph().parentWays(entity), 'id')
            });
        } else {
            startloc = entity.loc;
            if (!flag) {
                context.perform(
                    iD.actions.Noop());
            }
        }
        //if(entity.tags&&entity.modelName&&iD.data.DataType.HIGHWAY==entity.modelName){
        activeIDs = _.pluck(context.graph().parentWays(entity), 'id');
        activeIDs.push(entity.id);
        //}
        context.enter(mode);

    }

    function datum() {
        /*        if (d3.event.sourceEvent.altKey) {
         return {};
         }*/
        var d = d3.event.sourceEvent.target.__data__;
        if (!d) { return {} };
        var modelConfig = iD.Layers.getLayer(d.layerId, d.modelName);
        if (modelConfig && modelConfig.editable) {
            return d;
        } else {
            return {};
        }
        // return d3.event.sourceEvent.target.__data__ || {};
    }

    // via https://gist.github.com/shawnbot/4166283
    function childOf(p, c) {
        if (p === c) return false;
        while (c && c !== p) c = c.parentNode;
        return c === p;
    }

    function move(entity) {
        if (filter(entity, 'ing')) return;
        if (selectedWays && isSingleNode(entity, context)) {

        } else if (selectedWays) {
            if (willBeSingleNode(entity, context)) {
                context.variable.singleNodeByTopoSplit = true;
                context.enter(iD.modes.Browse(context));
                return;
            }
        }

        if (!d3.event.sourceEvent.altKey) {
            //altPopFlag=false;
            if (altPopFlag) {
                altPopFlag = false;
                if (isOverlay(entity)) {
                    filter(entity, 'end')
                } else {
                    context.pop();
                }
                behavior.cancel();
            }
            context.enter(iD.modes.Browse(context));
            return;
        }


        if (cancelled) return;
        d3.event.sourceEvent.stopPropagation();

        var nudge = childOf(context.container().node(),
            d3.event.sourceEvent.toElement) &&
            edge(d3.event.point, context.map().dimensions());

        if (nudge) startNudge(nudge);
        else stopNudge();

        var loc = context.map().mouseCoordinates();

        var d = datum();
        if (d.layerId == entity.layerId) {
            if (d.type === 'node' && d.id !== entity.id) {
                loc = d.loc;
            } else if (d.type === 'way' && !d3.select(d3.event.sourceEvent.target).classed('fill')) {
                loc = iD.geo.chooseEdge(context.childNodes(d), context.mouse(), context.projection).loc;
            }
        }
        if (!entity.loc) {
            entity.loc = loc;
        }
        if (loc.length == 2) {
            if (entity.loc[2]) {
                loc.push(entity.loc[2]);
            } else {
                loc.push(-1);
            }

        }
        let temp1;
        if ([iD.data.DataType.BARRIER_GEOMETRY_NODE, iD.data.DataType.OBJECT_PT].includes(entity.modelName)) {
            // let type = iD.Mapping.aboveGround.OBJECT_PT;
            // if (entity.modelName == iD.data.DataType.BARRIER_GEOMETRY_NODE) {
            //     let way = 
            //     type = iD.Mapping.aboveGround.BARRIER_GEOMETRY[entity.tags.TYPE];
            // }
            // temp1 = getAboveGround(context, context.map().mouse(), type);
            // if (temp1 == null) {
            //     // Dialog.alert("未找到对应位置的高程，请重新选择");
            //     return;
            // }
        } else {
            temp1 = getPlyZ(loc);
        }

        if (temp1 != null) loc[2] = temp1;
        let actions = [];
        if ([iD.data.DataType.PAVEMENT_DISTRESS_NODE,iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE].includes(entity.modelName)) {
            actions = [
                iD.actions.MoveNode(entity.id, loc),
                iD.actions.PavementDistreesMeasureinfo(entity.id),
                moveAnnotation(entity)
            ]
        } else {
            actions = [
                iD.actions.MoveNode(entity.id, loc),
                moveAnnotation(entity)
            ]
        }

        context.replace.apply(this, actions);
        // context.replace(
        //     // iD.actions.MoveNode(entity.id, loc),
        //     actions
        //     moveAnnotation(entity));

        if (entity.modelName == iD.data.DataType.OBJECT_PG_NODE) {
            let way = context.graph().parentWays(entity)[0];
            let nodes = context.childNodes(way);
            let locs = _.pluck(nodes, 'loc');

            if (locs.length == 5
                // && iD.util.isRectangle(...locs)
                && iD.util.entityIsRect(way)) {
                dragObjectRect(nodes, entity, loc);
                return;
            }
        }
    }

    function isInWay(entity, way) {
        var flag = false;
        context.graph().parentWays(entity).forEach(function (w) {
            if (way.id == w.id) {
                flag = true;
            }
        });
        return flag;
    }

    function isLinkNode(entity, d)  //判断两个节点是否有共用节点和共用线
    {
        var flag = false;
        var nodes = [];
        context.graph().parentWays(entity).forEach(function (w) {
            nodes.push(w.nodes[0]);
            nodes.push(w.nodes[w.nodes.length - 1]);
        });
        context.graph().parentWays(d).forEach(function (w) {
            if (-1 != nodes.indexOf(w.nodes[0]) || -1 != nodes.indexOf(w.nodes[w.nodes.length - 1])) {
                flag = true;
            }
        });
        return flag;
    }

    /**
    * 新增加车道线，判断新增车道线节点是否可绘制
    * @param {*} way 
    */
    function getLoc(locs) {
        var flag = false;
        if (!context.editArea()) {
            return flag;
        }
        var holes = context.editArea().coordinates;
        for (var j = 0; j < holes.length; j++) {
            var holes_nodes = [];
            for (var k = 0; k < holes[j].length - 1; k++) {
                if (flag && !isNaN(flag[0])) {
                    break;
                }
                holes_nodes = [
                    holes[j][k],
                    holes[j][k + 1]
                ];
                let zone_ = null;
                let utmLocs1 = holes_nodes.map(function (v) {
                    let utm = iD.util.LLtoUTM_(v[0], v[1]);
                    zone_ = utm.zoneNumber;
                    return [utm.x, utm.y]
                });
                let utmLocs2 = locs.map(function (v) {
                    let utm = iD.util.LLtoUTM_(v[0], v[1]);
                    return [utm.x, utm.y]
                });
                let newLoc = iD.geo.lineIntersection(utmLocs1, utmLocs2);
                flag = newLoc && iD.util.UTMtoLL_(newLoc[0], newLoc[1], zone_);
            }
        }
        if (!flag || !flag.length) return locs[0];

        let temp1 = getPlyZ(flag);
        flag[2] = locs[1][2];
        if (temp1 != null) {
            flag[2] = temp1;
        } else {
            Dialog.alert("高程计算失败，裁剪点高程可能有误");
        }
        return flag;
    }

    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    function wayNodeOutofBorder(node, way) {
        let dataType = iD.data.DataType;
        let isOut = !iD.util.entityInPlyGon(node, context);
        let isFirstNode = way.first() == node.id;
		let index = way.nodes.indexOf(node.id);
        let loc1 = node.loc;
        let loc2;
        if (isFirstNode) {
            loc2 = context.entity(way.nodes[1]).loc;
        } else {
            loc2 = context.entity(way.nodes[index - 1]).loc;
        }
        //车道线控制逻辑
        // if ((node.modelName == dataType.DIVIDER_NODE && node.tags.DASHTYPE != '0')) {
        //     return false;
        // } else if(isOut) {
        if (isOut) {
            var newLoc = getLoc([
                loc2,
                loc1
            ]);
            var actions = [];
            actions.push(iD.actions.MoveNode(node.id, newLoc));
            // 绘制超出范围后中断，需要将最后一点设置为边界点
            actions.push(iD.actions.ChangeTags(node.id, {
                ISSPLIT: '1'
            }));
            actions.push('超出范围，线形裁剪');

            context.replace(...actions);

        }
        return false;
    }

    function nodeOutofBorder(node) {
        // let graph = context.graph();
        let way = context.graph().parentWays(node)[0];
        if (!way) return true;

        let dataType = iD.data.DataType;
        let wayTypes = [dataType.DIVIDER, dataType.BARRIER_GEOMETRY, dataType.OBJECT_PL];
        // let areaTypes = [dataType.DIVIDER, dataType.BARRIER_GEOMETRY, dataType.OBJECT_PL];

        if ([dataType.OBJECT_PG, dataType.OBJECT_PL].includes(way.modelName) && !context.transactionEditor()) {
            let fNode = context.entity(way.first());

            if (!iD.util.justNodeInPlyGonx(fNode, context)) {
                return true;
            }
        } else if ([dataType.TRAFFICSIGN, dataType.TRAFFICLIGHT].includes(way.modelName) && !context.transactionEditor()) {
            var locs = _.pluck(context.graph().childNodes(way), 'loc');
            var loc = iD.util.getCenterPoint(locs);
            if (iD.util.pointNotInPlyGonx(loc, context)) {
                return true;
            }
        } else if (wayTypes.includes(way.modelName)) {
            return wayNodeOutofBorder(node, way);
        }
        return false
    }

    function isOutOfBorder(entity) {
        //TODO 跳出范围判断
        //--TODO--//
        // if(entity instanceof iD.Node && (context.transactionEditor() 
        // || !iD.util.pointNotInPlyGonx(geoLoc, context)
        // || node.tags.DASHTYPE != '0')){
        //     return false;
        // }
        // if (entity instanceof iD.Node && !iD.util.entityInPlyGon(entity, context)) {
        //     return true;
        // }
        if (entity instanceof iD.Node) {
            return nodeOutofBorder(entity);
        }
        if (entity instanceof iD.Way && !iD.util.entityInPlyGon(entity, context)) return true;
        return false;
    }

    function dimIsOutOfBorder(entity) {
        //TODO 跳出范围判断
        return false;
        //--TODO--//
        if (entity instanceof iD.Node && !iD.util.justNodeInPlyGonx(entity, context)) return true;
        if (entity instanceof iD.Way && !iD.util.wayInPlyGonx(entity, context)) return true;
        return false;
    }

    //过滤关系线
    function filterParentways(graph, entity) {
        var ways = graph.parentWays(entity), r = [];
        for (var i = 0; i < ways.length; i++) {
            var way = ways[i];
            if (!way.isOneRoadCrossWay()) r.push(way);
        }
        return r;
    }

    //收费站或者门禁信息禁止结点粘连
    function isAssistInfoOrTollgate(graph, entity) {
        if (entity.tags.tollgate && entity.tags.tollgate == "1") {
            return true;
        }
        var parentRels = graph.parentRelations(entity);
        for (var i = 0; i < parentRels.length; i++) {
            if (parentRels[i].modelName == iD.data.DataType.NODECONN) {
                var secondeRels = graph.parentRelations(parentRels[i]);
                for (var j = 0; j < secondeRels.length; j++) {
                    if (secondeRels[j].modelName == iD.data.DataType.ASSISTINFO && secondeRels[j].tags && "0" != secondeRels[j].tags.block_type) {
                        return true;
                    }
                }
            }
        }
        return false;

    }



    function isSameType(entity, way) {
        if ((entity.modelName == iD.data.DataType.WALKENTER && way.modelName && way.modelName == iD.data.DataType.WALKLINK)
            || (entity.modelName == iD.data.DataType.ROAD_NODE && way.modelName && way.modelName == iD.data.DataType.ROAD)) {
            return true;
        }

        return false;
    }

    function getPlyZ(loc) {
        let xyz = iD.util.getPlyZ(context, loc);
        return xyz;
    }

    // function getAboveGround(context, xy, type) {
    //     let z = iD.util.aboveGroundMeasure(context, xy, type);
    //     return z;
    // }

    function dragObjectRect(nodes, datum, loc, isVerification = false) {
        function _nodesIndex(index, diff) {
            var diffend = index + diff;
            if (diffend >= 0) {
                return diffend % 4
            } else {
                return 4 + index + diff;
            }
        }
        let nowIndex = nodes.findIndex(d => {
            return d.id == datum.id;
        })
        // let nowPoint = nodes[nowIndex];

        var crossIndex = _nodesIndex(nowIndex, 2);
        var crossPoint = nodes[crossIndex];
        var prevIndex = _nodesIndex(nowIndex, -1);
        var prevPoint = nodes[prevIndex];
        var nextIndex = _nodesIndex(nowIndex, 1);
        var nextPoint = nodes[nextIndex];
        nowLoc = loc;

        let prevLoc = [], nextLoc = [];

        let p1 = context.projection(crossPoint.loc);
        let p2 = context.projection(prevPoint.loc);
        let p3 = context.projection(nextPoint.loc);
        let p4 = context.projection(nowLoc);

        iD.util.pedal([p1[0], p1[1], p2[0], p2[1]], [p4[0], p4[1]], prevLoc);
        iD.util.pedal([p1[0], p1[1], p3[0], p3[1]], [p4[0], p4[1]], nextLoc);
        prevLoc = context.projection.invert(prevLoc);
        nextLoc = context.projection.invert(nextLoc);
        // 更新激光位置

        prevLoc[2] = prevPoint.loc[2];
        nextLoc[2] = nextPoint.loc[2];

        let temp1 = getPlyZ(prevLoc);
        let temp2 = getPlyZ(nextLoc);
        let temp3 = getPlyZ(nowLoc);

        if (temp1 != null) prevLoc[2] = temp1;
        if (temp2 != null) nextLoc[2] = temp2;
        if (temp3 != null) nowLoc[2] = temp3;


        // 更新地图位置
        let actions = [];

        actions.push(iD.actions.MoveNode(nodes[prevIndex].id, prevLoc));
        actions.push(iD.actions.MoveNode(nodes[nowIndex].id, nowLoc));
        actions.push(iD.actions.MoveNode(nodes[nextIndex].id, nextLoc));
        actions.push('更改地面区域');
        if (isVerification && (!temp1 || !temp2 || !temp3)) {
            return false
        }
        context.replace(...actions);
    }

    function end(_entity) {
        let entity = context.entity(_entity.id);
        if (filter(entity, 'end')) {
            //context.undo();
            return;
        }
        if (selectedWays && isSingleNode(entity, context)) {

        } else if (selectedWays) {
            if (willBeSingleNode(entity, context)) {
                context.variable.singleNodeByTopoSplit = true;
                context.enter(iD.modes.Browse(context));
                return;
            }
        }

        if (!d3.event.sourceEvent.altKey) {

            if (altPopFlag) {
                altPopFlag = false;
                if (isOverlay(entity)) {
                    filter(entity, 'end')
                } else {
                    context.pop();
                }
                behavior.cancel();
            }
            context.enter(iD.modes.Browse(context));
            return;
        }

        if (isOutOfBorder(context.entity(entity.id))) {
            Dialog.alert("对象编辑出界", function () {
                context.pop();
                context.enter(iD.modes.Browse(context));
            });
            return;
        }
        if (cancelled) return;
        var d = datum();

        if (d instanceof iD.Entity && dimIsOutOfBorder(d)) {
            Dialog.alert("目标对象不可编辑", function () {
                context.pop();
                context.enter(iD.modes.Browse(context));
            });
            return;
        }
        //边框点（BOUNDARY=20）不能是真实节点（REALNODE=1-真实节点）
        if (d instanceof iD.Node && d.modelName == iD.data.DataType.ROAD_NODE && d.tags.boundary == "20" && d.tags.realnode == "0") {
            Dialog.alert("目标点为跨图幅边框点，不能是真实节点", function () {
                context.pop();
                context.enter(iD.modes.Browse(context));
            });
            return;
        }
        let arr = [iD.data.DataType.ROAD_NODE,iD.data.DataType.DIVIDER_NODE,iD.data.DataType.OBJECT_PL,iD.data.DataType.PAVEMENT_DISTRESS_NODE,iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE];
        if (arr.includes(entity.modelName)) {
            let xyz = getPlyZ(entity.loc);

            if (xyz == null) {
                Dialog.alert("当前位置，无法获取高程值！");
                context.pop();
                context.enter(iD.modes.Browse(context));
                return;
            }
        }

        // 继承被拖拽点的关系
        var actionConnect = iD.actions.ConnectDivider;

        // if (d.layerId == entity.layerId && wasMidpoint) {
        if (entity.modelName == iD.data.DataType.ROAD_NODE && !wasMidpoint) {

            // 拖拽到Road上
            if (d.type === 'way' && !d.isOneRoadCrossWay()) {
                if (isInWay(entity, d)) {
                    Dialog.alert("不能将节点移动到自身连接道路上", function () {
                        context.pop();
                        context.enter(iD.modes.Browse(context));
                    })
                } else if (isSameType(entity, d)) {
                    var choice = iD.geo.chooseEdge(context.childNodes(d), context.mouse(), context.projection);
                    let _layer = iD.Layers.getLayer(entity.layerId);
                    let _z = getPlyZ(entity.loc);
                    let _loc = entity.loc;
                    if (_z != null) {
                        _loc[2] = _z;
                    }
                    var newNode = iD.Node({
                        layerId: entity.layerId,
                        identifier: _layer.identifier,
                        modelName: iD.data.DataType.ROAD_NODE,
                        loc: _loc
                    });

                    var args = [iD.actions.AddEntity(newNode),
                    iD.actions.AddMidpoint({
                        loc: choice.loc,
                        edge: [d.nodes[choice.index - 1], d.nodes[choice.index]]
                    }, newNode),
                    iD.actions.SplitRoad([newNode.id], context, d.id),
                    iD.actions.UpdateNode(context, entity.id),
                    iD.actions.Connect(context, [newNode.id, entity.id]),
                    /**iD.actions.MoveLineSplitTuFu(context, entity),*/
                    connectAnnotation(d)];
                    var isroad = iD.Layers.getLayer(d.layerId).isRoad();
                    if (!isroad) {
                        args.splice(1, 2);
                    }
                    if (isroad && !iD.util.nodeIsBreakPoint(entity, context.graph())) {
                        var pway = context.graph().parentWays(entity)[0];
                        // 拖拽的点是ROAD上形状点，打断当前拖拽点所在ROAD
                        args.splice(args.length - 2, 0, iD.actions.SplitRoad([entity.id], context, pway.id));
                    }
                    if (!isroad || isroad && entity.modelName === iD.data.DataType.ROAD_NODE) {
                        context.replace.apply(this, args);
                    }
                    var way = context.graph().parentWays(entity).length > 0 ? context.graph().parentWays(entity) : [];
                    context.event['entityedite'] && context.event['entityedite']({ entitys: _.pluck(way, 'id') });
                }
            } else if (d.type === 'node' && d.id !== entity.id && !d.isRoadCross() && d.modelName == entity.modelName) {
                // ROAD结点拖动到结点上

                //道路结点的合并，不能合并伪结点
                if (filterParentways(context.graph(), d).length == 2 && isAssistInfoOrTollgate(context.graph(), d)) {
                    Dialog.alert("结点存在收费口或者门禁，不能执行粘连操作", function () {
                        context.pop();
                        context.enter(iD.modes.Browse(context));
                    })
                    return;
                }
                if (isLinkNode(entity, d)) {
                    Dialog.alert("不能合并具有共同连接道路的两个节点", function () {
                        context.pop();
                        context.enter(iD.modes.Browse(context));
                    })
                    return;
                } else {
                    let entityIsBP = iD.util.nodeIsBreakPoint(entity, context.graph());
                    let dIsBP = iD.util.nodeIsBreakPoint(d, context.graph());
                    // entity为形状点
                    args = [];


                    // entity和d都是悬挂点
                    //判断如果是道路&该道路的首尾节点，则直接连接不打断 TildenDing
                    if (entityIsBP && dIsBP) {
                        var args = [actionConnect(context, [entity.id, d.id]),
                        iD.actions.UpdateNode(context, d.id),
                        connectAnnotation(d)];
                        entity = d;
                    } else if (!entityIsBP && !dIsBP) {
                        args = [
                            iD.actions.SplitRoad([d.id], context),
                            iD.actions.UpdateNode(context, entity.id),
                            iD.actions.SplitRoad([entity.id], context),
                            // actionConnect(context, [d.id, entity.id]),
                            iD.actions.Connect(context, [d.id, entity.id]),
                            connectAnnotation(d)
                        ];
                    } else {
                        // entity和d都是形状点，都打断
                        // 先分别打断再连接共点Connect
                        var beforeArgs = [];
                        if (!dIsBP) {
                            beforeArgs.push(...[
                                iD.actions.SplitRoad([d.id], context)
                                // iD.actions.UpdateNode(context, d.id)
                            ]);
                        }
                        if (!entityIsBP) {
                            beforeArgs.push(...[
                                iD.actions.SplitRoad([entity.id], context)
                                // iD.actions.UpdateNode(context, entity.id)
                            ]);
                        }
                        beforeArgs.push(iD.actions.Connect(context, [d.id, entity.id]));
                        beforeArgs.push(iD.actions.UpdateNode(context, entity.id));
                        args.unshift(...beforeArgs);

                    }

                    /*                    if(!(is_road
                     && entity.modelName === 'Highway')){
                     args.splice(1, 1);
                     context.replace.apply(this,args);
                     entity=d;
                     }*/
                    context.replace.apply(this, args);
                    var way = context.graph().parentWays(entity).length > 0 ? context.graph().parentWays(entity) : [];
                    context.event['entityedite'] && context.event['entityedite']({ entitys: _.pluck(way, 'id') });
                }
            } /*else if (wasMidpoint) {
                context.replace(
                    iD.actions.Noop(),
                    iD.actions.UpdateNode(context, entity.id),
                    t('operations.add.annotation.vertex'));

            }*/ else {
                context.replace(
                    iD.actions.UpdateNode(context, entity.id),
                    /**iD.actions.MoveLineSplitTuFu(context, entity),*/
                    moveAnnotation(entity));
            }
        } else if (!wasMidpoint && entity.type === 'node') {
            // DIVIDER节点拖拽
            MoveEndToNode(entity, d);
        } else if (!wasMidpoint && entity.type === 'node') {
            var is_road = iD.Layers.getLayer(entity.layerId).isRoad();
            var args = [
                iD.actions.UpdateRealNode(context, entity.id, oldNodeEntity),
                iD.actions.UpdateNode(context, entity.id),
                // actionConnect([entity.id, entity.id]),
                // iD.actions.Split(entity.id),
                /**iD.actions.MoveLineSplitTuFu(context, entity),*/
                connectAnnotation(entity)];
            if (!is_road) {
                args.splice(1, 1);
            }
            if (!(is_road && entity.modelName === 'Highway')) {
                if (entity.tags && entity.modelName !== 'Point') {
                    context.replace.apply(this, args);
                    var way = context.graph().parentWays(entity).length > 0 ? context.graph().parentWays(entity) : [];
                    context.event['entityedite'] && context.event['entityedite']({ entitys: _.pluck(way, 'id') });
                    //context.event.entityedite({'entity' : way});
                }
            }
        } else if (wasMidpoint) {
            context.replace(
                iD.actions.Noop(),
                iD.actions.UpdateNode(context, entity.id),
                t('operations.add.annotation.vertex'));

        }

        var reselection = selectedIDs.filter(function (id) {
            return context.graph().hasEntity(id);
        });
        if (reselection.length) {

            if (context.graph().hasEntity(entity.id)) {
                context.enter(//拖拽复杂路口, 其关联线不再绘制, 只传拖拽的实体
                    iD.modes.Select(context, [entity.id])
                        .suppressMenu(true));
            } else {
                context.enter(iD.modes.Browse(context));
            }
        } else {
            context.enter(iD.modes.Browse(context));
        }

        // 共点时，删除被拖拽节点，保留目标节点
        var isConnect = context.hasEntity(entity.id) == null;
        iD.util.checkErrors(context.graph(), null, null, isConnect ? d : entity);
    }

    function MoveEndToNode(moveEntity, datum) {
        var moveIsBreakPoint = iD.util.nodeIsBreakPoint(moveEntity, context.graph());
        var datumIsBreakPoint = iD.util.nodeIsBreakPoint(datum, context.graph());
        // var isSameLayer = 
        if (!_.isEmpty(datum) && datum.id != moveEntity.id && moveIsBreakPoint && datumIsBreakPoint && (moveEntity.modelName == datum.modelName) && moveEntity.layerId == datum.layerId) {
            var args = [iD.actions.ConnectDivider(context, [moveEntity.id, datum.id]),
            connectAnnotation(datum)];
            context.replace.apply(this, args);
        } else {
            let loc = context.entity(moveEntity.id).loc;
            if ([
                iD.data.DataType.DIVIDER_NODE,
                iD.data.DataType.HD_LANE_NODE
            ].includes(moveEntity.modelName)) {

                let xyz = getPlyZ(loc);

                // let cRangeNodes = iD.util.selectNode_Z(loc, 10);
                // let tracks = [];
                // for (let i = 0; i < cRangeNodes.length; i++) {
                //     var rangeNodes = cRangeNodes[i];
                //     var node = iD.util.getNearestNode(loc, rangeNodes.nodes);
                //     tracks.push({
                //         node: node,
                //         cameraHeight: rangeNodes.cameraHeight,
                //         trackId: rangeNodes.trackId
                //     });
                // }
                // // console.log(disArr)
                // if (tracks.length != 0) {
                //     var nearrestTrack = iD.util.getNearestTracks(loc, tracks);
                //     loc[2] = nearrestTrack.node.loc[2] - nearrestTrack.cameraHeight;
                // }
                if (xyz != null) {
                    loc[2] = xyz;
                }
            }

            if ([iD.data.DataType.BARRIER_GEOMETRY_NODE, iD.data.DataType.OBJECT_PT].includes(moveEntity.modelName)) {
                let type = iD.Mapping.aboveGround.OBJECT_PT;
                if (moveEntity.modelName == iD.data.DataType.BARRIER_GEOMETRY_NODE) {
                    let way = context.graph().parentWays(moveEntity)[0];
                    context.variable.aboveGround.edge = 1;
                    if(way.tags.EDGE == 3){
                        context.variable.aboveGround.edge = 2;
                    }
                    type = iD.Mapping.aboveGround.BARRIER_GEOMETRY[way.tags.TYPE];
                }
                let z = iD.util.aboveGroundMeasure(context, loc, type); 
                if (z != null) {
                    loc[2] = z;
                } else {
                    Dialog.alert("未找到对应位置的高程，请重新选择");
                    context.pop();
                    return;
                }
            }

            context.replace(
                iD.actions.Noop(),
                iD.actions.UpdateNode(context, moveEntity.id),
                function (graph) {
                    if (moveEntity.modelName != iD.data.DataType.DIVIDER_NODE) {
                        return graph;
                    }
                    graph = iD.actions.MoveNode(moveEntity.id, loc)(graph);

                    graph = iD.actions.createDividerNodeMeasureinfo(
                        moveEntity.id
                    )(graph);
                    // 更新量测信息
                    return graph;
                },
                t('operations.add.annotation.vertex'));
        }
        var way = context.graph().parentWays(moveEntity).length > 0 ? context.graph().parentWays(moveEntity) : [];
        context.event['entityedite'] && context.event['entityedite']({ entitys: _.pluck(way, 'id') });
    }

    function cancel() {
        dragWayBehavior && dragWayBehavior.cancel();
        behavior.cancel();
        context.enter(iD.modes.Browse(context));
    }

    function setActiveElements() {
        context.surface().selectAll(iD.util.entitySelector(activeIDs))
            .classed('active', true);
    }


    function available(entity) {

        if (entity.isRoadNode()) {
            var meshCode = MapSheet.getMeshCode(entity, context);
            var rc;
            context.graph().parentRelations(entity).forEach(function (rel) {
                if (rel.tags && rel.modelName == iD.data.Constant.C_NODE) {
                    rc = rel;
                }
            })
            if (rc && meshCode != entity.tags.mesh) {

                return false;
            }

        }
        return true;
    }


    var behavior = iD.behavior.drag()
        .delegate('g.node, g.point, g.midpoint')
        .surface(context.surface().node())
        .origin(origin)
        .on('start', start)
        .on('move', move)
        .on('end', end);

    var dragWayBehavior = iD.behavior.ediftorWay ? iD.behavior.ediftorWay()
        .delegate('g.node, g.point, g.midpoint')
        .surface(context.surface() ? context.surface().node() : null)
        .origin(origin)
        .on('start', start)
        .on('move', move)
        .on('end', end)
        .on('off', off) : null;

    function off() {
        stopNudge();
    }

    mode.enter = function () {
        context.install(hover);
        context.install(edit);
        context.history()
            .on('undone.drag-node', cancel);
        context.map()
            .on('drawn.drag-node', setActiveElements);
        setActiveElements();
        var adasRoads = [];
        activeIDs.forEach(function (id) {
            var activeEntity = context.graph().entity(id);
            if (activeEntity instanceof iD.Way && iD.data.DataType.HIGHWAY == activeEntity.modelName && activeEntity.tags.adas != '0' && iD.Adas.isAdasRoad(id)) {
                adasRoads.push(id);
            }
        })
        if (adasRoads && adasRoads.length >= 1) {
            var adasPasswordTip = iD.ui.AdasPasswordTip(context, passwordRight, null, adasRoads);
            adasPasswordTip.perform('将要修改的道路是高精道路，请输入密码：');
        }
        function passwordRight(adasRoads) {
            iD.Adas.addAdaRoad(adasRoads);
        }
    };

    mode.exit = function () {
        context.uninstall(hover);
        context.uninstall(edit);

        context.history()
            .on('undone.drag-node', null);

        context.map()
            .on('drawn.drag-node', null);

        context.surface()
            .selectAll('.active')
            .classed('active', false);

        stopNudge();
    };

    mode.selectedIDs = function (_) {
        if (!arguments.length) return selectedIDs;
        selectedIDs = _;
        return mode;
    };

    var newNodeEntity = [];
    var wEnterAndRoadObj = new Object();
    /*
     mode.newNodeEntity = function(_) {
     if (!arguments.length) return newNodeEntity;
     newNodeEntity = _;
     return mode;
     };*/

    mode.behavior = behavior;
    mode.dragWayBehavior = dragWayBehavior;
    return mode;
};
