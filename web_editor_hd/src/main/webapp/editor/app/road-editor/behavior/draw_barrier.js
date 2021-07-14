/*
 * @Author: tao.w
 * @Date: 2019-06-06 16:29:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-01-25 19:36:02
 * @Description: 
 */
iD.behavior.DrawBarrier = function (context, wayId, index, mode, baseGraph) {
    var moveData, undoAndContine = false;
    var keybinding = d3.keybinding('DrawBarrier');
    var way = context.entity(wayId),
        constant = iD.data.DataType,
        isArea = context.geometry(wayId) === 'area',
        finished = false,
        annotation = t((way.isDegenerate() ?
            'operations.start.annotation.' :
            'operations.continue.annotation.') + context.geometry(wayId)),
        draw = iD.behavior.Draw(context),
        editLayer = iD.Layers.getLayer(way.layerId);
    let dnLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.BARRIER_GEOMETRY_NODE);
    var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
        start = iD.Node({
            loc: context.graph().entity(way.nodes[startIndex]).loc,
            modelName: iD.data.DataType.BARRIER_GEOMETRY_NODE,
            identifier: dnLayer.identifier,
            layerId: dnLayer.id
        }),
        end = iD.Node({
            loc: context.map().mouseCoordinates(),
            modelName: iD.data.DataType.BARRIER_GEOMETRY_NODE,
            identifier: dnLayer.identifier,
            layerId: dnLayer.id
        }),
        segment = iD.Way({
            nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            modelName: iD.data.DataType.BARRIER_GEOMETRY,
            identifier: dnLayer.identifier,
            layerId: iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.BARRIER_GEOMETRY).id,
            tags: _.clone(way.tags)
        });

    var f = context[way.isDegenerate() ? 'replace' : 'perform'];
    var firstNode = context.graph().entity(way.nodes[0]);
    var isWalkRoad = firstNode.modelName == constant.WALKENTER;
    var isHighWay = firstNode.modelName == constant.ROADNODE;

    isArea = false;


    f(iD.actions.AddEntity(start),
        iD.actions.AddEntity(end),
        iD.actions.AddEntity(segment));


    function move(datum) {
        moveData = datum;
        var loc, enableLayer = context.layers().getLayer(datum.layerId);
        // var loc, enableLayer = context.layers().getCurrentEnableLayer();
        if (datum.type === 'node' && datum.id !== end.id) {
            loc = datum.loc;
        } else if (datum.type === 'way' && datum.id !== segment.id && enableLayer && enableLayer.id === datum.layerId && !datum.isArea()) {
            loc = iD.geo.chooseEdge(context.childNodes(datum), context.mouse(), context.projection).loc;
        } else {
            loc = context.map().mouseCoordinates();
        }
        context.replace(iD.actions.MoveNode(end.id, loc));
    }



    function undone() {
        context.buriedStatistics().merge(0, iD.data.DataType.BARRIER_GEOMETRY);
        finished = true;
        context.enter(iD.modes.Browse(context));
    }

    function setActiveElements() {
        var active = isArea ? [wayId, end.id] : [segment.id, start.id, end.id];
        context.surface().selectAll(iD.util.entitySelector(active))
            .classed('active', true);
    }
 
    function cancelWholeWay() {
        context.replace(iD.actions.AddEntity(way), annotation);
        var nodes = way.nodes;
        // var firstNodeID = nodes[0];
        for (var i = 0; i < nodes.length; i++) {
            context.undo();
        }

        finished = true;

        context.enter(iD.modes.AddRoad(context));


    }
    var drawWay = function (surface) {
        draw.on('move', move)
            .on('click', drawWay.add)
            .on('clickWay', drawWay.addWay)
            .on('clickNode', drawWay.addNode)
            .on('undo', context.undo)
            .on('cancel', drawWay.cancel)
            .on('finish', drawWay.finish);


        keybinding.on('Shift+Z', cancelWholeWay);
        d3.select(document)
            .call(keybinding);

        context.map()
            .dblclickEnable(false)
            .on('drawn.draw', setActiveElements);

        setActiveElements();

        surface.call(draw);

        context.history()
            .on('undone.draw', undone);
    };

    drawWay.off = function (surface) {

        if (!finished && undoAndContine == false) {
            var upnode = context.graph().entity(way.nodes[0]);
            upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
            context.replace(
                iD.actions.AddEntity(upnode),
                annotation
            );
            upnode = context.graph().entity(way.nodes[way.nodes.length - 1]);
            upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
            context.replace(
                iD.actions.AddEntity(upnode),
                annotation
            );
            if (isHighWay) {
                context.replace(
                    iD.actions.AddRoad(way),
                    annotation
                );
            }
            else if (isWalkRoad) {
                context.replace(
                    iD.actions.AddWalkRoad(way),
                    annotation
                );
            }
            context.pop();

        }

        context.map()
            .on('drawn.draw', null);

        surface.call(draw.off)
            .selectAll('.active')
            .classed('active', false);

        context.history()
            .on('undone.draw', null);
        keybinding.off();
    };

    function ReplaceTemporaryNode(newNode) {
        return function (graph) {

            // var currLayer = context.layers().getCurrentEnableLayer();
            var currLayer = context.layers().getLayer(newNode.layerId);

            newNode.layerId = iD.Layers.getCurrentModelEnableLayer(newNode.modelName).id; // currLayer.id; //设置绘制过程中点的图层ID

            if (isArea) {
                //if(firstNode)
                //newNode.tags = {datatype: constant.LANUSE};
                // newNode.tags = {datatype: firstNode.modelName};
                graph = graph
                    .replace(way.addNode(newNode.id, index))
                    .remove(end);
                return graph;
            } else {
                var graph = graph
                    .replace(graph.entity(wayId).addNode(newNode.id, index))
                    .remove(end)
                    .remove(segment)
                    .remove(start);
                if (currLayer.split) {
                    var parents = graph.parentWays(newNode); //当前是否与图幅相交的线段
                    //return MapSheet.splitLine(parents, graph, context); //如果画的线跨图幅边界，则进行分隔!!!!!
                    return graph;
                } else {
                    return graph;
                }

            }
        };
    }

    drawWay.add = function (loc) {
        let type = Number(context.variable.aboveGround.attr.TYPE);
        let mtype = iD.Mapping.aboveGround.BARRIER_GEOMETRY[type];
        let z = iD.util.aboveGroundMeasure(context,loc,mtype);

        if(z != null){
            loc[2] = z;
        }else{
            Dialog.alert("未找到对应位置的高程，请重新选择");
            return;
        }

        var cNode;
        if (typeof index === 'undefined') {
            cNode = context.hasEntity(way.nodes[way.nodes.length - (isArea ? 2 : 1)]);
        } else {
            cNode = context.graph().entity(way.nodes[index < 0 ? 0 : index]);//continue drawing.
        }
        // if (cNode && cNode.loc[0] === loc[0] && cNode.loc[1] === loc[1]) return;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.BARRIER_GEOMETRY_NODE);
        var nodeLayerId = nodeLayer.id;
        var newNode = new iD.Node({
            loc: loc,
            layerId: nodeLayerId,
            identifier: nodeLayer.identifier,
            modelName: constant.BARRIER_GEOMETRY_NODE,
            tags: iD.util.getDefauteTags(constant.BARRIER_GEOMETRY_NODE, nodeLayer)
        });

        var cIndex = way.nodes.indexOf(cNode.id), tags = _.clone(cNode.tags);
        var actions = [
            iD.actions.AddEntity(newNode),
            iD.actions.ChangeTags(cNode.id, tags),
            ReplaceTemporaryNode(newNode),
            function (graph) {
                let _wayNodes = graph.entity(wayId).nodes;
                // 绘制第二个点时开始补充起点量测信息
                if (_wayNodes.length == 2) {
                    graph = iD.actions.createDividerNodeMeasureinfo(
                        _wayNodes[0],
                        _wayNodes
                    )(graph);
                }
                return iD.actions.createDividerNodeMeasureinfo(
                    newNode.id,
                    _wayNodes
                )(graph);
            },
            annotation
        ];

        if (cIndex === 0 && way.nodes.length < 2)
            actions.splice(1, 1);

        context.replace.apply(this, actions);

        finished = true;
        context.enter(mode);
        updatePicplayer();
    };

    // Connect the way to an existing way.
    drawWay.addWay = function (loc, edge, originalEntity) {
        drawWay.add(loc);
        return;
    };

    // Connect the way to an existing node and continue drawing.
    drawWay.addNode = function (node) {
		var mouseLocAll = null;
		if( !d3.event.ctrlKey ){
			mouseLoc = context.map().mouseCoordinates();
			mouseLocAll = [ mouseLoc[0], mouseLoc[1], node.loc[2] ];
		}
		var locs = mouseLocAll || _.clone(node.loc);
        drawWay.add(locs);
        return;
    };

    // Finish the draw operation, removing the temporary node. If the way has enough
    // nodes to be valid, it's selected. Otherwise, return to browse mode.
    drawWay.finish = function () {
        context.buriedStatistics().merge(0, iD.data.DataType.BARRIER_GEOMETRY);
        context.pop();
        finished = true;

        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);

        context.map().on('dragend', null);

        if (context.hasEntity(wayId)) {
            context.enter(
                iD.modes.Select(context, [wayId])
                    .suppressMenu(true)
                    .newFeature(true));
        } else {
            context.enter(iD.modes.Browse(context));
        }
        updatePicplayer();
    };

    // Cancel the draw operation and return to browse, deleting everything drawn.
    drawWay.cancel = function () {
        // context.buriedStatistics().merge(0,iD.data.DataType.BARRIER_GEOMETRY);
        context.perform(
            d3.functor(baseGraph),
            t('operations.cancel_draw.annotation'));

        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);
        finished = true;
        context.enter(iD.modes.Browse(context));
        updatePicplayer();
    };

    drawWay.tail = function (text) {
        draw.tail(text);
        return drawWay;
    };

    function updatePicplayer() {
        var way = context.hasEntity(wayId);
        if (way) {
            var nodes = way.nodes;
            context.event.entityedite({
                entitys: [wayId],
                acceptids: [wayId].concat(nodes)
            });
        } else {
            context.event.entityedite({});
        }
    }

    return drawWay;
};
