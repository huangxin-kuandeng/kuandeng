/*
 * @Author: tao.w
 * @Date: 2019-06-06 16:29:10
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-28 11:13:45
 * @Description: 
 */
iD.behavior.DrawObjectPl = function (context, wayId, index, mode, baseGraph) {
    var moveData, undoAndContine = false;
    var keybinding = d3.keybinding('DrawOBJECT_PL');
    var way = context.entity(wayId),
        constant = iD.data.DataType,
        isArea = context.geometry(wayId) === 'area',
        finished = false,
        annotation = t((way.isDegenerate() ?
            'operations.start.annotation.' :
            'operations.continue.annotation.') + context.geometry(wayId)),
        draw = iD.behavior.Draw(context),
        editLayer = iD.Layers.getLayer(way.layerId);
    let plnLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PL_NODE);

    var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
        start = iD.Node({
            loc: context.graph().entity(way.nodes[startIndex]).loc,
            modelName: iD.data.DataType.OBJECT_PL_NODE,
            identifier: plnLayer.identifier,
            layerId: plnLayer.id
        }),
        end = iD.Node({
            loc: context.map().mouseCoordinates(),
            modelName: iD.data.DataType.OBJECT_PL_NODE,
            identifier: plnLayer.identifier,
            layerId: plnLayer.id
        }),
        segment = iD.Way({
            identifier: plnLayer.identifier,
            nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            modelName: iD.data.DataType.OBJECT_PL,
            layerId: iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PL).id,
            tags: _.clone(way.tags)
        });
    var isConnectFakeNode = false;
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



        //????????????????????????????????????????????????????????????????????????
        if (way.inline && iD.Layers.getLayer(way.layerId).isRoad() && datum.tags && datum.modelName == constant.ROADNODE) {
            if (firstNode.modelName == constant.WALKENTER) {

            }
            else {
                drawWay.finish();
                delete way.inline;
                if (isConnectFakeNode) {
                    var nodeID = way.nodes[way.nodes.length - 1];
                    datum = context.graph().entity(nodeID);
                }
                var graph = context.graph();
                var fromNode = graph.entity(datum.id);
                startFromNode(fromNode);
            }
        }
        //      updatePicplayer();
    }



    function startFromNode(node) {

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PL);
        var wayLayerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PL).id;
        var way = iD.Way({
            identifier: wayLayer.identifier,
            layerId: wayLayerId
        });
        way.modelName = iD.data.DataType.OBJECT_PL;
        way.setTags(iD.util.getDefauteTags(way, iD.Layers.getLayer(way.layerId)));

        if (firstNode.modelName != constant.WALKENTER) {
            // way.tags.isnewway = 'true';
            var flag = iD.walkRoadFlag.ROAD;

        }
        else {
            var flag = iD.walkRoadFlag.WALKROAD;
        }
        var args = [iD.util.SplitRoadRule([node.id], context, flag, node),
        iD.actions.AddEntity(way),
        iD.actions.AddVertex(way.id, node.id)]
        if (node.tags/* && (node.tags['datatype'] == 'RoadNode' || node.tags['datatype'] == constant.WALKENTER)*/) {
            args.splice(0, 1);
        }
        context.perform.apply(this, args)
        context.enter(iD.modes.DrawLine(context, way.id, context.graph(), '', 'road'));
    }

    function undone() {
        finished = true;
        context.buriedStatistics().merge(0, iD.data.DataType.OBJECT_PL);
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
                    //???????????????????????????realnode??????
                    if (isHighWay) {
                        newNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(context.graph(), newNode);
                        newNode = iD.util.tagExtend.updateNodeMeshTag(newNode, context);
                    }
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
            createWayWithHighwayNode();
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

            newNode.layerId = iD.Layers.getCurrentModelEnableLayer(newNode.modelName).id; // currLayer.id; //?????????????????????????????????ID

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
                    var parents = graph.parentWays(newNode); //????????????????????????????????????
                    //return MapSheet.splitLine(parents, graph, context); //????????????????????????????????????????????????!!!!!
                    return graph;
                } else {
                    return graph;
                }

            }
        };
    }

    drawWay.add = function (loc) {
        if (checkLineNodeDistanceLTE(loc)) {
            return;
        }
        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("???????????????????????????????????????");
            this.finish();
            return;
        }

        var cNode;
        if (typeof index === 'undefined') {
            cNode = context.hasEntity(way.nodes[way.nodes.length - (isArea ? 2 : 1)]);
        } else {
            cNode = context.graph().entity(way.nodes[index < 0 ? 0 : index]);//continue drawing.
        }
        // if (cNode && cNode.loc[0] === loc[0] && cNode.loc[1] === loc[1]) return;
        var nodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PL_NODE);
        var nodeLayerId = nodeLayer.id;
        var newNode = new iD.Node({
            loc: loc,
            layerId: nodeLayerId,
            identifier: nodeLayer.identifier,
            modelName: constant.OBJECT_PL_NODE,
            tags: iD.util.getDefauteTags(constant.OBJECT_PL_NODE, nodeLayer)
        });

        var cIndex = way.nodes.indexOf(cNode.id), tags = _.clone(cNode.tags);
        var actions = [
            iD.actions.AddEntity(newNode),
            iD.actions.ChangeTags(cNode.id, tags),
            ReplaceTemporaryNode(newNode),
            function (graph) {
                let _wayNodes = graph.entity(wayId).nodes;
                // ???????????????????????????????????????????????????
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
        drawWay.add(node.loc);
        return;
    };

    // Finish the draw operation, removing the temporary node. If the way has enough
    // nodes to be valid, it's selected. Otherwise, return to browse mode.
    drawWay.finish = function () {
        context.buriedStatistics().merge(0, iD.data.DataType.OBJECT_PL);
        context.pop();
        finished = true;

        createWayWithHighwayNode();

        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);

        context.map().on('dragend', null);

        if (context.hasEntity(wayId)) {
            context.enter(
                iD.modes.Select(context, [wayId])
                    .suppressMenu(true)
                    .newFeature(true));
            if (editLayer.continues) {
                if (mode.button === "area" && editLayer.isRoad()) {
                    //context.enter(iD.modes.AddWalkArea(context));
                } else if (mode.button === "area") {
                    context.enter(iD.modes.AddArea(context));
                } else if (mode.button === "line" && editLayer && !editLayer.isRoad()) {
                    context.enter(iD.modes.AddLine(context));
                } else if (mode.button === "line" && editLayer && editLayer.isRoad()) {
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
                    var endNodeId = way.nodes[way.nodes.length - 1];
                    var graph = editor.context.graph();
                    var endNode = graph.entity(endNodeId);
                }

            }
            if (isWalkRoad) {
                context.replace(
                    iD.actions.AddWalkRoad(way),
                    annotation
                );
            }
            //???????????????????????????
            var newWay = context.entity(wayId);
            var tNode = context.entity(newWay.last());
            if (tNode.tags.boundary && tNode.tags.boundary == "20" && tNode.tags.realnode && tNode.tags.realnode == "0") {
                Dialog.alert("??????????????????????????????????????????????????????", function () {
                    context.enter(iD.modes.Browse(context));
                });
                updatePicplayer();
                return;
            }
        } else {
            if (isWalkRoad && way.nodes.length > 1) {
                context.replace(
                    iD.actions.AddWalkRoad(way),
                    annotation
                );
            }
            context.enter(iD.modes.Browse(context));
        }
        updatePicplayer();
    };

    // Cancel the draw operation and return to browse, deleting everything drawn.
    drawWay.cancel = function () {
        context.buriedStatistics().merge(0, iD.data.DataType.OBJECT_PL);
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

    /**
     * ???????????????????????????
     * @param {Array} loc2
     * @param {Object} opts
     * 		distance???	???????????????cm
     * 		alert???		????????????
     */
    function checkLineNodeDistanceLTE(loc2, opts = { distance: 0.2, alert: true }) {
        return false;

    }

    return drawWay;
};
