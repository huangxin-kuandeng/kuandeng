iD.behavior.DrawWay = function (context, wayId, index, mode, baseGraph) {
    var moveData, undoAndContine = false;
    var keybinding = d3.keybinding('DrawWay');
    var way = context.entity(wayId),
        constant = iD.data.DataType,
        isArea = context.geometry(wayId) === 'area',
        finished = false,
        annotation = t((way.isDegenerate() ?
            'operations.start.annotation.' :
            'operations.continue.annotation.') + context.geometry(wayId)),
        draw = iD.behavior.Draw(context);
    // editLayer = iD.Layers.getCurrentEnableLayer();
    var _layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD_NODE);
    var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
        start = iD.Node({ loc: context.graph().entity(way.nodes[startIndex]).loc, modelName: constant.ROAD_NODE }),
        end = iD.Node({ loc: context.map().mouseCoordinates(), modelName: constant.ROAD_NODE }),
        segment = iD.Way({
            identifier: _layer.identifier,
            nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            tags: _.clone(way.tags),
            layerId: iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD_NODE).id,
            modelName: constant.ROAD
        });
    var isConnectFakeNode = false;
    var f = context[way.isDegenerate() ? 'replace' : 'perform'];
    var firstNode = context.graph().entity(way.nodes[0]);

    f(iD.actions.AddEntity(start),
        iD.actions.AddEntity(end),
        iD.actions.AddEntity(segment));




    function move(datum) {
        moveData = datum;
        // var loc, enableLayer = context.layers().getCurrentEnableLayer();
        var loc,
            // enableLayer = context.layers().getCurrentEnableLayer(iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD).id);
            enableLayer = context.layers().getLayer(iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD).id);
        if (datum.type === 'node' && datum.id !== end.id) {
            loc = datum.loc;
        } else if (datum.type === 'way' && datum.id !== segment.id && enableLayer && enableLayer.id === datum.layerId && !datum.isArea()) {
            loc = iD.geo.chooseEdge(context.childNodes(datum), context.mouse(), context.projection).loc;
        } else {
            loc = context.map().mouseCoordinates();
        }
        context.replace(iD.actions.MoveNode(end.id, loc), "绘制线的点");

    }


    function undone() {
        context.buriedStatistics().merge(0, iD.data.DataType.ROAD);
        finished = true;
        context.enter(iD.modes.Browse(context));
    }

    function setActiveElements() {
        var active = isArea ? [wayId, end.id] : [segment.id, start.id, end.id];
        context.surface().selectAll(iD.util.entitySelector(active))
            .classed('active', true);
    }


    function createWayWithHighwayNode() {
        if (window.fakeNodesArr && window.fakeNodesArr[0]) {
            var fakeNode = window.fakeNodesArr[0];
            var nodesArr = way.nodes;
            let layer = iD.Layers.getLayer(fakeNode.layerId);
            nodesArr.forEach(function (nodeID) {
                if (nodeID == fakeNode.id) {
                    var newNode = iD.Node({
                        layerId: fakeNode.layerId,
                        identifier: layer.identifier,
                        loc: fakeNode.loc,
                        modelName: constant.ROAD_NODE
                    });

                    context.replace(iD.actions.AddEntity(newNode), annotation);

                    var graph = context.graph();
                    var parentWays = graph.parentWays(fakeNode);

                    parentWays.forEach(function (way) {
                        var wayNodesArr = way.nodes;
                        wayNodesArr.forEach(function (wayNode) {
                            if (wayNode == fakeNode.id) {
                                way = way.replaceNode(nodeID, newNode.id);
                                context.replace(iD.actions.AddEntity(way), annotation);
                            }
                        });
                    });
                    context.replace(iD.actions.DeleteNode(nodeID), annotation);
                    way = context.graph().entity(way.id);
                    //更新道路首尾结点的realnode字段

                    newNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(context.graph(), newNode);
                    newNode = iD.util.tagExtend.updateNodeMeshTag(newNode, context);

                    context.replace(iD.actions.AddEntity(newNode), annotation);
                }
            });

            isConnectFakeNode = true;
        }
    }

    function cancelWholeWay() {
        context.replace(iD.actions.AddEntity(way), annotation);
        var nodes = way.nodes;
        // var firstNodeID = nodes[0];
        for (var i = 0; i < nodes.length; i++) {
            context.undo();
        }
        /*   context.replace(ReplaceTemporaryNode(context.graph().entity(firstNodeID)),annotation);
         nodes.splice(0, nodes.length);
         way.nodes = [];
         context.replace(
         iD.actions.AddEntity(way))*/

        finished = true;

        context.enter(iD.modes.AddRoad(context));


    }

    //回退到上一步操作,并不间断继续画路
    //后续的需求可能会需要该功能
    /*  function undoAndContinueDraw() {
     var tmpNodes = way.nodes;
     if (tmpNodes.length >= 2) {
     var nodeID = way.nodes[way.nodes.length - 1];
     var joinpointID = way.nodes[way.nodes.length - 2];
     var nodes = [];

     for (var i = 0; i < way.nodes.length - 1; i++) {
     nodes[i] = way.nodes[i];
     }
     way.nodes = nodes;

     context.replace(
     ReplaceTemporaryNode(context.graph().entity(joinpointID)));

     context.replace(
     iD.actions.DeleteNode(nodeID));

     var lastNodeID = way.nodes[way.nodes.length - 1];
     var lastNode = context.graph().entity(lastNodeID);
     lastNode.tags.datatype = "RoadNode";

     context.replace(
     iD.actions.AddEntity(way));
     undoAndContine = true;
     finished = true;
     context.enter(mode);
     }
     }*/

    var drawWay = function (surface) {
        draw.on('move', move)
            .on('click', drawWay.add)
            .on('clickWay', drawWay.addWay)
            .on('clickNode', drawWay.addNode)
            .on('undo', context.undo)
            .on('cancel', drawWay.cancel)
            .on('finish', drawWay.finish);

        /*  keybinding.on('Shift+Z', undoAndContinueDraw);
         d3.select(document)
         .call(keybinding);*/

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
            // createWayWithHighwayNode();
            // var upnode = context.graph().entity(way.nodes[0]);
            // upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
            // context.replace(
            //     iD.actions.AddEntity(upnode),
            //     annotation
            // );
            // upnode = context.graph().entity(way.nodes[way.nodes.length - 1]);
            // upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
            // context.replace(
            //     iD.actions.AddEntity(upnode),
            //     annotation
            // );
            //
            //     context.replace(
            //         iD.actions.AddRoad(way),
            //         annotation
            //     );
            context.pop();
        }
        if (finished && context.hasEntity(way.id) && context.entity(way.id).nodes.length > 1) {
            context.replace(
                iD.actions.AddRoad(way.id, context),
                annotation
            );
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

            newNode.layerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD_NODE).id; //设置绘制过程中点的图层ID

            if (isArea) {
                //if(firstNode)
                //newNode.tags = {datatype: constant.LANUSE};
                // newNode.tags = {datatype: firstNode.tags.datatype};
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
                // if (currLayer.split) {
                //     var parents = graph.parentWays(newNode); //当前是否与图幅相交的线段
                //     //return MapSheet.splitLine(parents, graph, context); //如果画的线跨图幅边界，则进行分隔!!!!!
                //     return graph;
                // } else {
                return graph;
                // }

            }
        };
    }

    // Accept the current position of the temporary node and continue drawing.
    drawWay.add = function (loc) {
        var cNode;

        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("当前位置，无法获取高程值！");
            this.finish();
            return;
        }

        if (typeof index === 'undefined') {
            cNode = context.hasEntity(way.nodes[way.nodes.length - (isArea ? 2 : 1)]);
        } else {
            cNode = context.graph().entity(way.nodes[index < 0 ? 0 : index]);//continue drawing.
        }
        if (cNode && cNode.loc[0] === loc[0] && cNode.loc[1] === loc[1]) return;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(constant.ROAD_NODE);
        var newNode = new iD.Node({
            loc: loc, layerId: nodeLayer.id,
            identifier: nodeLayer.identifier,
            modelName: constant.ROAD_NODE
        });

        var cIndex = way.nodes.indexOf(cNode.id), tags = _.clone(cNode.tags);
        newNode.setTags(iD.util.getDefauteTags(newNode, iD.Layers.getLayer(newNode.layerId)));
        var actions = [iD.actions.AddEntity(newNode),
        // iD.actions.ChangeTags(cNode.id, tags),
        ReplaceTemporaryNode(newNode),
            annotation];

        // if (cIndex === 0 && way.nodes.length < 2)
        //     actions.splice(1, 1);

        //添加道路的点
        iD.logger.editElement({
            'tag': 'add_' + cNode.modelName,
            'entityId': cNode.osmId(),
            'coordinate': cNode.loc,
            'modelName': cNode.modelName
        });
        context.replace.apply(this, actions);

        finished = true;
        context.enter(mode);
    };

    // Connect the way to an existing way.
    drawWay.addWay = function (loc, edge, originalEntity) {
        var previousEdge = startIndex ?
            [way.nodes[startIndex], way.nodes[startIndex - 1]] :
            [way.nodes[0], way.nodes[1]];

        // Avoid creating duplicate segments
        if (iD.geo.edgeEqual(edge, previousEdge))
            return;
        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("当前位置，无法获取高程值！");
            this.finish();
            return;
        }

        //不允许划线与自己相交
        var parents = _.intersection(
            context.graph().parentWays(context.entity(edge[0])),
            context.graph().parentWays(context.entity(edge[1])));
        if (parents.indexOf(way) != -1) {
            return;
        }
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(constant.ROAD_NODE);
        var nodeLayerId = iD.Layers.getCurrentModelEnableLayer(constant.ROAD_NODE).id;
        var newNode = iD.Node({
            loc: loc,
            identifier: nodeLayer.identifier,
            layerId: nodeLayerId
        });
        newNode.modelName = constant.ROAD_NODE;
        newNode.setTags(iD.util.getDefauteTags(newNode, iD.Layers.getLayer(newNode.layerId)));
        context.perform(
            iD.actions.AddEntity(newNode),
            ReplaceTemporaryNode(newNode),
            annotation);

        finished = true;
        context.enter(mode);
    };

    // Connect the way to an existing node and continue drawing.
    drawWay.addNode = function (node) {
        // Avoid creating duplicate segments
        if (way.areAdjacent(node.id, way.nodes[way.nodes.length - 1])) return;

        //自相交判断
        if (way.nodes.indexOf(node.id) != -1) {
            return;
        }

        var actions = [];
        let layer = iD.Layers.getLayer(node.layerId);
        var newNode = iD.Node({
            layerId: node.layerId,
            identifier: layer.identifier,
            loc: node.loc,
            modelName: constant.ROAD_NODE
        });
        newNode.setTags(iD.util.getDefauteTags(newNode, iD.Layers.getLayer(newNode.layerId)));
        actions.push(iD.actions.AddEntity(newNode));
        actions.push(...[ReplaceTemporaryNode(newNode),
            annotation]);
        context.perform.apply(this, actions);


        finished = true;
        context.enter(mode);

    };

    // Finish the draw operation, removing the temporary node. If the way has enough
    // nodes to be valid, it's selected. Otherwise, return to browse mode.
    drawWay.finish = function () {
        context.buriedStatistics().merge(0, iD.data.DataType.ROAD);
        context.pop();
        finished = true;

        createWayWithHighwayNode();

        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);

        if (context.hasEntity(wayId)) {
            context.enter(
                iD.modes.Select(context, [wayId])
                    .suppressMenu(true)
                    .newFeature(true));
            // if (editLayer.continues) {
            //     if (mode.button === "area" && editLayer.isRoad()) {
            //         //context.enter(iD.modes.AddWalkArea(context));
            //     } else if (mode.button === "area") {
            //         context.enter(iD.modes.AddArea(context));
            //     } else if (mode.button === "line" && editLayer && !editLayer.isRoad()) {
            //         context.enter(iD.modes.AddLine(context));
            //     } else if (mode.button === "line" && editLayer && editLayer.isRoad()) {
            //         var upnode = context.graph().entity(way.nodes[0]);
            //         upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
            //         context.replace(
            //             iD.actions.AddEntity(upnode),
            //             annotation
            //         );
            //         upnode = context.graph().entity(way.nodes[way.nodes.length - 1]);
            //         upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
            //         context.replace(
            //             iD.actions.AddEntity(upnode),
            //             annotation
            //         );
            //
            //             context.replace(
            //                 iD.actions.AddRoad(way),
            //                 annotation
            //             );
            //
            //         var endNodeId = way.nodes[way.nodes.length - 1];
            //         var graph = editor.context.graph();
            //         var endNode = graph.entity(endNodeId);
            //     }
            //
            // }

            //新建道路结点的判断
            var newWay = context.entity(wayId);
            var tNode = context.entity(newWay.last());
            //添加道路结束
            iD.logger.editElement({
                'tag': 'add_' + newWay.modelName + '_end',
                'entityId': newWay.osmId(),
                'modelName': newWay.modelName
            });
            if (tNode.tags.boundary && tNode.tags.boundary == "20" && tNode.tags.realnode && tNode.tags.realnode == "0") {
                Dialog.alert("目标点为跨图幅边框点，不能是真实节点", function () {
                    context.enter(iD.modes.Browse(context));
                });
                return;
            }
        } else {

            context.enter(iD.modes.Browse(context));
        }
    };

    // Cancel the draw operation and return to browse, deleting everything drawn.
    drawWay.cancel = function () {
        context.perform(
            d3.functor(baseGraph),
            t('operations.cancel_draw.annotation'));

        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);
        finished = true;
        context.enter(iD.modes.Browse(context));
    };

    drawWay.tail = function (text) {
        draw.tail(text);
        return drawWay;
    };

    return drawWay;
};
