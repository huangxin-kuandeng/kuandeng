iD.behavior.DrawFusionDivider = function (context, wayId, index, mode, baseGraph) {
    var moveData, undoAndContine = false;
    var keybinding = d3.keybinding('DrawDivider');
    var way = context.entity(wayId),
        constant = iD.data.DataType,
        isArea = context.geometry(wayId) === 'area',
        finished = false,
        annotation = t((way.isDegenerate() ?
                'operations.start.annotation.' :
                'operations.continue.annotation.') + context.geometry(wayId)),
        draw = iD.behavior.Draw(context),
        editLayer = iD.Layers.getLayer();
        // editLayer = iD.Layers.getCurrentEnableLayer();
    var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
        start = iD.Node({loc: context.graph().entity(way.nodes[startIndex]).loc}),
        end = iD.Node({loc: context.map().mouseCoordinates()}),
        segment = iD.Way({
            nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            tags: _.clone(way.tags)
        });
    var isConnectFakeNode = false;
    var f = context[way.isDegenerate() ? 'replace' : 'perform'];
    var firstNode = context.graph().entity(way.nodes[0]);
    var isWalkRoad = firstNode.modelName == constant.WALKENTER;
    var isHighWay = firstNode.modelName == constant.ROADNODE;
    // if (isWalkArea) {
    isArea = false;

        f(iD.actions.AddEntity(start),
            iD.actions.AddEntity(end),
            iD.actions.AddEntity(segment));

    //var firstNode = context.graph().entity(way.nodes[0]);
    //if(firstNode.modelName == constant.WALKAREA){
    //    isArea = true;
    //}
    if (isWalkRoad) {
        var roadcross = d3.select('g.layer.layer-roadcross')
        roadcross.classed("no-pointer-events", true);
        var placename = d3.select('g.layer.layer-placename')
        placename.classed("no-pointer-events", true);
    }
    else if (isHighWay) {
        var walklink = d3.select('g.layer.layer-walk')
        walklink.classed("no-pointer-events", true);
    }
    function move(datum) {
        moveData = datum;
        // var loc, enableLayer = context.layers().getCurrentEnableLayer();
        var loc, enableLayer = context.layers().getLayer(datum.layerId);
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
                        identifier:layer.identifier,
                        layerId: fakeNode.layerId,
                        loc: fakeNode.loc,
                        //    tags: {datatype: iD.data.DataType.ROADNODE}
                    });
                    /*if (isHighWay) {
                        newNode.setTags({datatype: iD.data.DataType.ROAD_NODE});
                    }
                    else if (isWalkRoad) {
                        newNode.setTags({datatype: iD.data.DataType.WALKENTER});
                    }*/
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
        /*   context.replace(ReplaceTemporaryNode(context.graph().entity(firstNodeID)),annotation);
         nodes.splice(0, nodes.length);
         way.nodes = [];
         context.replace(
         iD.actions.AddEntity(way))*/

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
            var layerid = iD.Layers.getCurrentModelEnableLayer(newNode.modelName)?iD.Layers.getCurrentModelEnableLayer(newNode.modelName).id:currLayer.id;
            newNode.layerId = layerid; // currLayer.id; //?????????????????????????????????ID

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

    // Accept the current position of the temporary node and continue drawing.
    drawWay.add = function (loc) {
        var cNode;
        if (typeof index === 'undefined') {
            cNode = context.hasEntity(way.nodes[way.nodes.length - (isArea ? 2 : 1)]);
        } else {
            cNode = context.graph().entity(way.nodes[index < 0 ? 0 : index]);//continue drawing.
        }
        if (cNode && cNode.loc[0] === loc[0] && cNode.loc[1] === loc[1]) return;
        let layer = iD.Layers.getLayer(way.layerId);
        var newNode = new iD.Node({
            loc: loc,
            identifier:layer.identifier,
            layerId: way.layerId,
            modelName:constant.DIVIDER_NODE
        });
        // newNode.modelName = constant.FUSION_DIVIDER_NODE;

        newNode.setTags(iD.util.getDefauteTags(newNode, iD.Layers.getLayer(newNode.layerId)));

        var cIndex = way.nodes.indexOf(cNode.id), tags = _.clone(cNode.tags);
        modelName = constant.DIVIDER;
        newNode.setTags(iD.util.getDefauteTags(newNode, iD.Layers.getLayer(newNode.layerId)));
        var actions = [iD.actions.AddEntity(newNode),
            iD.actions.ChangeTags(cNode.id, tags),
            ReplaceTemporaryNode(newNode),
            annotation];

        if (cIndex === 0 && way.nodes.length < 2)
            actions.splice(1, 1);

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
        if (!isArea && iD.geo.edgeEqual(edge, previousEdge))
            return;

        //??????????????????????????????
        var parents = _.intersection(
            context.graph().parentWays(context.entity(edge[0])),
            context.graph().parentWays(context.entity(edge[1])));

        if (parents.indexOf(way) != -1) {
            return;
        }
        var last = context.hasEntity(way.nodes[way.nodes.length - (isArea ? 2 : 1)]);
        let layer = iD.Layers.getLayer(way.layerId);
        var newNode = iD.Node({loc: loc,
            identifier:layer.identifier,
            layerId: way.layerId
        });
        newNode.modelName = constant.DIVIDER_NODE;
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

            //???????????????
            if (way.nodes.indexOf(node.id) != -1) {
                return;
            }

            // ????????????????????????????????????node??
            if (node.modelName == iD.data.DataType.DIVIDER_NODE) {
                var last = context.hasEntity(way.nodes[way.nodes.length - 1]);
                var index = way.nodes.indexOf(last.id);
                way['inline'] = 1;
                var actions = [];
                var tags = _.clone(last.tags);
                var newNode;
                context.perform(iD.actions.Noop(), t('modes.add_road.description'));
                if (node.modelName == iD.data.DataType.DIVIDER_NODE) {
                    // var graph = context.graph();
                    // var parentWays = graph.parentWays(node);
                    // parentWays.some(function (way) {
                    //     if(way.first() != node.id || way.last() != node.id){
                        let layer = iD.Layers.getLayer(node.layerId);
                            newNode = iD.Node({
                                layerId: node.layerId,
                                identifier:layer.identifier,
                                loc: node.loc,
                                modelName: iD.data.DataType.DIVIDER_NODE
                            });
                    newNode.setTags(iD.util.getDefauteTags(newNode, iD.Layers.getLayer(newNode.layerId)));
                    actions.push(iD.actions.AddEntity(newNode));
                    // }
                    // });
                    actions.push(...[ ReplaceTemporaryNode(newNode),
                        annotation]);
                    context.perform.apply(this, actions);
                }

            }

            finished = true;
            context.enter(mode);

    };

    // Finish the draw operation, removing the temporary node. If the way has enough
    // nodes to be valid, it's selected. Otherwise, return to browse mode.
    drawWay.finish = function () {

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
