/**
 * Created by wt on 2015/8/3.
 */
iD.topo.NodeSaat = function () {
    var topoNodeSaat = {};
    topoNodeSaat.roadMerge = function (graph,way, wayA, wayB, rel,midNode,crossNodeM,crossNodeS,crossNodeE) {
        var member=rel.memberByRole(iD.data.RoleType.ROAD_ID);
        var nodeMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
        if(nodeMember.id!=midNode.id)
        {
            member.id=way.id;
            rel = rel.updateMember(member, member.index);
            rel.tags = iD.util.tagExtend.updateTaskTag(rel);
        }
        return graph.replace(rel);
    };

    /*道路打断原本存在的saat维护*/
    topoNodeSaat.break = function (context,graph, way, wayA, wayB, rel) {
        var roadMember = rel.memberByRole(iD.data.RoleType.ROAD_ID);       // 根据role为road获取对应的道路member成员
        var noadMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);       // 根据role为node获取对应的道路member成员
        var wayNodesLength = way.nodes.length;
        if (!(wayNodesLength == 0)) {
            if (roadMember && noadMember && (noadMember.id == way.nodes[0]) && (roadMember.id == way.id)) {
                roadMember.id = wayA.id;
            } else if (roadMember && noadMember && (noadMember.id == way.nodes[wayNodesLength - 1]) && (roadMember.id == way.id)) {
                roadMember.id = wayB.id;
            }
            ;
        }
        ;
        rel = rel.updateMember(roadMember, roadMember.index);
        rel.tags = iD.util.tagExtend.updateTaskTag(rel);
        graph = graph.replace(rel);
        return graph;
    }

    /*道路打断点的saat维护*/
    topoNodeSaat.breakNode = function (graph, node, wayA, wayB,way,context) {
        graph = createNewSaat(graph, wayA.id, node.id);
        graph = createNewSaat(graph, wayB.id, node.id);
        return graph;
    }

    //自动补全一个结点的saat拓补关系
    topoNodeSaat.autoCompleteNodeTopo = function (graph, nodeID) {
        graph = createFullNodeSaat(graph, nodeID);
        return graph;
    }

    /*道路相交的saat维护*/
    topoNodeSaat.roadIntersect = function (graph, node, oldWays) {
        return graph;
    }

    /*道路拓补打断对原先结点entityB和拖动的新结点entityA的saat维护*/
    topoNodeSaat.topoSplit = function (graph, entityA, entityB, wayId) {
        graph = createFullNodeSaat(graph, entityB.id);
        graph = createFullNodeSaat(graph, entityA.id);
        return graph;
    }


    topoNodeSaat.roadCreate = function (graph, nodeId) {
      //  graph = createNewSaat(graph, wayId, nodeId);
        graph = createFullNodeSaat(graph, nodeId);
        return graph;
    }

    topoNodeSaat.roadCrossEdit = function (graph, node) {
        //return createFullNodeMaat(graph,node.id);
        return graph;
    }

    topoNodeSaat.crossNodeMerge = function (graph, crossNodeA, crossNodeB) {
        return graph;
    }
    topoNodeSaat.nodeMerge = function (context,graph, nodeA, nodeB) {
        //return createFullNodeMaat(graph,node.id);
        if(nodeA.isRoadNode()&&nodeB.isRoadNode()){
            graph.parentRelations(nodeA).forEach(function (rel) {
                if (rel.modelName == iD.data.DataType.NODEINFO) {
                    var member = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
                    member.id = nodeB.id;
                    rel = rel.updateMember(member, member.index);
                    rel.tags = iD.util.tagExtend.updateTaskTag(rel);
                    graph = graph.replace(rel);
                }
            })
            return createFullNodeSaat(graph, nodeB.id);
        }else{
            return graph;
        }
    }
    topoNodeSaat.nodeMove=function(context,graph,node){
        return graph;
    }

    /*根据结点id自动补全所有关联的nodesaat拓补关系 */
    function createFullNodeSaat(graph, nodeId) {
        var isInArray = function (array, element) {
            if (array && element) {
                for (var i in array) {
                    if (array[i] == element) {
                        return true;
                    }
                }
            }
            return false;
        };

        var node = graph.entity(nodeId);
        var ways = graph.parentWays(node);
        var newNodeSaatWayIds = new Array();    //所有关联道路的id数组
        ways.forEach(function (way) {
            if (!way.isOneRoadCrossWay()) {
                newNodeSaatWayIds.push(way.id);
            }
        });
        var parentRelations = graph.parentRelations(node);//获取所有存在的拓补关系

        var oldNodeSaatWayIds = new Array();        //从老的relations中取出所有的关联道路，过滤不存在的道路结点saat
        parentRelations.forEach(function (relation) {
            if (relation.modelName == iD.data.DataType.NODEINFO) {
                if (!isInArray(newNodeSaatWayIds, relation.memberByRole(iD.data.RoleType.ROAD_ID).id)) {
                    graph = graph.remove(relation);
                } else {
                    relation.tags = iD.util.tagExtend.updateTaskTag(relation);
                    graph = graph.replace(relation);
                    oldNodeSaatWayIds.push(relation.memberByRole(iD.data.RoleType.ROAD_ID).id);
                }
            }
        });

        newNodeSaatWayIds.forEach(function (newWayId) {
            if (!isInArray(oldNodeSaatWayIds, newWayId)) {
                graph = createNewSaat(graph, newWayId, nodeId);
            }
        });
        return graph;
    }


    function createNewSaat(graph, wayId, nodeId) {
        var nodeSaatMember = [
            {'id': wayId, 'role': iD.data.RoleType.ROAD_ID,'type': iD.data.GeomType.WAY,'modelName':iD.data.DataType.ROAD},
            {'id': nodeId,'role': iD.data.RoleType.ROAD_NODE_ID,'type': iD.data.GeomType.NODE,'modelName':iD.data.DataType.ROAD_NODE}
            ];
        // layers = iD.Layers;
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.NODEINFO);
        let layerId = currentLayer.id;
        var nodeSaatRelations = iD.Relation({
            modelName:iD.data.DataType.NODEINFO,
            members: nodeSaatMember,
            identifier:currentLayer.identifier,
            tags: iD.util.getDefauteTags(iD.data.DataType.NODEINFO, currentLayer),
            layerId: layerId
        });
        //var node = graph.entity(nodeId);
        //if(node.tags.mesh&&node.tags.mesh.length>0){
        //    nodeSaatRelations = nodeSaatRelations.mergeTags({mesh:node.tags.mesh});
        //}
        graph = graph.replace(nodeSaatRelations);
        return graph;
    };

    return topoNodeSaat;
}