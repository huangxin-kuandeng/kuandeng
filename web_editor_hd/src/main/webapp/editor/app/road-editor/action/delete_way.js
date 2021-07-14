// https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/DeleteWayAction.as
iD.actions.DeleteWay = function (wayId) {
    function deleteNode(node, graph) {
        //        return !graph.parentWays(node).length &&
        //            !graph.parentRelations(node).length &&
        //            !node.hasInterestingTags();
        var i = 0;
        graph.parentWays(node).forEach(function (way) {
            if (!way.isOneRoadCrossWay()) {
                i++;
            }
        })
        return 0 == i;
    }

    function getWayBBox(graph, wayA, epsion) {
        var nodes = wayA.nodes;
        var maxLat = -Infinity,
            minLat = Infinity,
            maxLon = -Infinity,
            minLon = Infinity;
        nodes.forEach(function (nodeId) {
            var node = graph.entity(nodeId);
            var loc = node.loc;
            if (loc[0] > maxLon) {
                maxLon = loc[0];
            }
            if (loc[0] < minLon) {
                minLon = loc[0];
            }
            if (loc[1] > maxLat) {
                maxLat = loc[1];
            }
            if (loc[1] < minLat) {
                minLat = loc[1]
            }
        })
        //0.1m = 0.037秒，1度= 3600‘    1度 =1*10e5m
        return [
            [minLon - epsion, minLat - epsion],
            [maxLon + epsion, maxLat + epsion]
        ];
    }


    var action = function (graph) {
        var way = graph.entity(wayId);
        var fNode = graph.entity(way.first());
        var tNode = graph.entity(way.last());

        //当删除道路共点时，判断为共点需要充值其属性。TildenDing
        var fways = graph.parentWays(fNode);
        var tways = graph.parentWays(tNode);
        if (fways.length == 1) {
            var defaultNode = iD.util.getDefauteTags(fNode.modelName, iD.Layers.getLayer(fNode.layerId));
            fNode.tags = defaultNode;
        } else {
            fNode.tags = iD.util.tagExtend.updateTaskTag(fNode);
        }

        if (tways.length == 1) {
            var defaultNode = iD.util.getDefauteTags(tNode.modelName, iD.Layers.getLayer(tNode.layerId));
            tNode.tags = defaultNode;
        } else {
            tNode.tags = iD.util.tagExtend.updateTaskTag(tNode);
        }

        if (!way.isOneRoadCrossWay()) {
            graph.parentRelations(way)
                .forEach(function (parent) {
                    if (way.modelName == iD.data.DataType.DIVIDER && parent.modelName == iD.data.DataType.R_DIVIDER_DREF && parent.members.length >=2) {
                        parent = parent.removeMembersWithID(way.id);
                        graph = graph.replace(parent);
                    }else{
                        graph = iD.actions.DeleteRelation(parent.id)(graph);
                    }
                });

            _.uniq(way.nodes).forEach(function (nodeId) {
                way = way.removeNode(nodeId)
                graph = graph.replace(way);
                // graph = graph.replace(way.removeNode(nodeId));

                if (graph.hasEntity(nodeId)) {
                    var node = graph.entity(nodeId);
                    //if (!way.isOneRoadCrossWay()) graph = deleteNodeOfCrossWay(node, graph);
                    if (deleteNode(node, graph) && node.modelName !== iD.data.Constant.C_NODE) {
                        // graph = graph.remove(node);
                        graph = iD.actions.DeleteNode(node.id)(graph);
                    }
                }
            });
        }
        /**
         _.uniq(way.nodes).forEach(function(nodeId) {
            way = way.removeNode(nodeId);
            graph = graph.replace(way);
            var node = graph.entity(nodeId);
            if(deleteNode(node, graph) && node.modelName !== iD.data.Constant.C_NODE){
                graph = graph.remove(node);
            }
        });
         */
        graph = graph.remove(way);
        if (graph.hasEntity(fNode.id) != undefined) {
            fNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph, fNode);
            graph = graph.replace(fNode);
            graph = iD.util.tagExtend.updateRelationsTagsByRealNode(graph, fNode);
        }
        if (graph.hasEntity(tNode.id) != undefined) {
            tNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph, tNode);
            graph = graph.replace(tNode);
            graph = iD.util.tagExtend.updateRelationsTagsByRealNode(graph, tNode);
        }
        return graph;
    };

    action.disabled = function () {
        return false;
    };

    return action;
};