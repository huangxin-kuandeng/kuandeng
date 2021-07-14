/**
 * Created by wt on 2015/8/3.
 */
iD.topo.CrossMaat = function () {
    var topoCrossMaat = {};
    topoCrossMaat.roadMerge = function (graph, way, wayA, wayB, rel,midNode, crossNodeM, crossNodeS, crossNodeE) {

        if (crossNodeS && crossNodeE && crossNodeS.id == crossNodeE.id) {
            return graph;
        }
        var fromMember = rel.memberByRole(iD.data.RoleType.FROAD_ID);
        var toMember = rel.memberByRole(iD.data.RoleType.TROAD_ID);
//      var nodeMember=rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
		var nodeMember=rel.memberByRole(iD.data.RoleType.C_NODE_ID);
        if (fromMember && toMember) {
            if ((crossNodeS&&nodeMember.id==crossNodeS.id)||(crossNodeE&&nodeMember.id==crossNodeE.id)) {
                if (fromMember.id == wayA.id || fromMember.id == wayB.id) {
                    fromMember.id = way.id;
                    rel = rel.updateMember(fromMember, fromMember.index);
                    rel.tags = iD.util.tagExtend.updateTaskTag(rel);
                }
                if (toMember.id == wayA.id || toMember.id == wayB.id) {
                    toMember.id = way.id;
                    rel = rel.updateMember(toMember, toMember.index);
                    rel.tags = iD.util.tagExtend.updateTaskTag(rel);
                }
            }
        }
        return graph.replace(rel);
    };

    /*道路打断CrossMaat的拓补维护*/
    topoCrossMaat.break = function (context,graph, way, wayA, wayB, rel) {
    	let topoEntity = iD.TopoEntity();
        var fromRoadMember = rel.memberByRole(iD.data.RoleType.FROAD_ID);       // 根据role为from_road获取对应的道路member成员
        var toRoadMember = rel.memberByRole(iD.data.RoleType.TROAD_ID);
//      var RoadCrossMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);       // 根据node获取对应的道路member成员
		var RoadCrossMember = rel.memberByRole(iD.data.RoleType.C_NODE_ID);       // 根据node获取对应的道路member成员
        var roadCrossEntity = graph.entity(RoadCrossMember.id);          //综合交叉点实体
        let cmembers = topoEntity.getCrossNodeMembers(graph, roadCrossEntity.id);
        var nodeMembers = [];
        for (var k = 0; k < (cmembers.length); k++) {
            nodeMembers[k] = cmembers[k].id;
        }
        var wayNodesLength = way.nodes.length;

        if (fromRoadMember && nodeMembers && (fromRoadMember.id == way.id)) {
            if ((!(nodeMembers.indexOf(way.nodes[0]) == -1))) {
                fromRoadMember.id = wayA.id;
            } else if ((!(nodeMembers.indexOf(way.nodes[wayNodesLength - 1]) == -1))) {
                fromRoadMember.id = wayB.id;
            }
            ;
            rel.tags = iD.util.tagExtend.updateTaskTag(rel);
            rel = rel.updateMember(fromRoadMember, 0);
        }

        if (toRoadMember && nodeMembers && (toRoadMember.id == way.id)) {
            if ((!(nodeMembers.indexOf(way.nodes[0]) == -1))) {
                toRoadMember.id = wayA.id;
            } else if ((!(nodeMembers.indexOf(way.nodes[wayNodesLength - 1]) == -1))) {
                toRoadMember.id = wayB.id;
            }
            ;
            rel.tags = iD.util.tagExtend.updateTaskTag(rel);
            rel = rel.updateMember(toRoadMember, 2);
        }
        graph = graph.replace(rel);
        return graph;
    }

    //自动补全一个结点的maat拓补关系
    topoCrossMaat.autoCompleteNodeTopo = function (graph, nodeID) {
        graph = createFullCrossMaat(graph, nodeID);
        return graph;
    }

    /*道路相交的crossmaat维护*/
    topoCrossMaat.roadIntersect = function (graph, nodesArr, oldWays) {
        //判断一条道路实体是不是综合交叉点内部道路
        var isInnerWay = function (way) {
            var topoEntity = iD.TopoEntity();
            var crossNodeIdA = topoEntity.isInCrossNode(graph, way.nodes[0]);
            var crossNodeIdB = topoEntity.isInCrossNode(graph, way.nodes[way.nodes.length - 1]);
            if (crossNodeIdA !== false && crossNodeIdB !== false && crossNodeIdA == crossNodeIdB) {
                return way;
            }
            return false;
        }

        oldWays.forEach(function (way) {
            var innerWay = isInnerWay(way);
            if (innerWay !== false) {
                nodesArr.forEach(function (node) {
                    graph = createFullCrossMaat(graph, node.id);
                })
            }
        })

        return graph;
    };


    //道路拓补打断对原先结点entityB和拖动的新结点entityA的crossmaat维护
    topoCrossMaat.topoSplit = function (graph, entityA, entityB, wayId) {
        var graph = createFullCrossMaat(graph, entityB.id);
        var graph = createFullCrossMaat(graph, entityA.id);
        return graph;
    };

    topoCrossMaat.roadCreate = function (graph, nodeId) {
        var graph = createFullCrossMaat(graph, nodeId);
        //   graph = addCorssMaatForNode(graph, way, node);
        return graph;
    }


    topoCrossMaat.roadCrossEdit = function (graph, node) {
        return createFullCrossMaat(graph, node.id);
    }

    topoCrossMaat.crossNodeMerge = function (graph, crossNodeA, crossNodeB) {
        if (crossNodeA && crossNodeB) {
            graph.parentRelations(crossNodeA).forEach(function (rel) {
                if (rel.modelName == iD.data.DataType.C_NODE) {
                    var member = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
                    member.id = crossNodeB.id;
                    rel = rel.updateMember(member, member.index);
                    rel.tags = iD.util.tagExtend.updateTaskTag(rel);
                    graph = graph.replace(rel);
                }
            })
        }
        return graph;
    }

    topoCrossMaat.nodeMerge = function (context,graph, nodeA, nodeB) {
        return graph;
    }

    topoCrossMaat.nodeMove=function(context,graph,node){
        return graph;
    }

    //根据被综合点id找到其对应的关联的综合交叉点,完善其所有的crossmaat拓补关系
    function createFullCrossMaat(graph, nodeId) {
        var topoEntity = iD.TopoEntity();
        var crossNodeId = topoEntity.isInCrossNode(graph, nodeId);
        var connectWayIDs = findConnectWaysArrByNode(graph, crossNodeId);
        if (crossNodeId !== false && connectWayIDs !== false) {
            connectWayIDs.forEach(function (wayId) {
                graph = createCMaatByCNode(graph, wayId, crossNodeId, connectWayIDs);
            })
        }
        //综合交叉点没有关联的道路,删除综合交叉点的关系
        if (crossNodeId !== false && connectWayIDs == false) {
            graph = createCMaatByCNode(graph, connectWayIDs, crossNodeId, connectWayIDs);
        }
        return graph;
    }

    //根据综合交叉点id所有的关联的外部道路，如果没有被综合交叉点关联返回false，否则返回所有道路id数组
    function findConnectWaysArrByNode(graph, crossNodeId) {
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

        //判断一条道路是不是综合交叉点内部道路,array为内部点数组，way为道路实体
        var isInnerWay = function (array, way) {
            if ((isInArray(array, way.nodes[0]) && isInArray(array, way.nodes[way.nodes.length - 1]))) {
                return true;
            }
            return false;
        }
        let topoEntity = iD.TopoEntity();
        if (crossNodeId != false) {
            // var roadCross = graph.entity(crossNodeId);
            // var roadCrossMembers = roadCross.members;
            var roadCrossMembers = topoEntity.getCrossNodeMembers(graph,crossNodeId);
            var innerNodeIds = [];      //获取综合交叉点包含的所有内部点
            var connectWayIDs = new Array();
            roadCrossMembers.forEach(function (member) {
                innerNodeIds.push(member.id);
            });

            //内部结点所关联的道路数组connectWays，滤除重复道路、内部道路和综合交叉线
            innerNodeIds.forEach(function (innerNodeId) {
                var innerNodeEntity = graph.entity(innerNodeId);
                var ways = graph.parentWays(innerNodeEntity);
                ways.forEach(function (way) {
                    if (!isInArray(connectWayIDs, way.id) && !isInnerWay(innerNodeIds, way)) {
                        if (!way.isOneRoadCrossWay()) {
                            connectWayIDs.push(way.id);
                        }
                    }
                })
            })

            if (connectWayIDs.length == 0) {
                return false;
            } else {
                return connectWayIDs;
            }
        }
        return false;
    }

    //根据传入的道路和结点进行完整的crossmaat的维护   wayId关联道路，nodeId综合交叉点id，newCrossMaatWaysId所有的关联道路id数组
    function createCMaatByCNode(graph, wayId, nodeId, newCrossMaatWaysId) {
        var node = graph.entity(nodeId);
        var isInArray = function (array, element) {
            for (var i in array) {
                if (array[i].toString() == element.toString()) {
                    return true;
                }
            }
            return false;
        };
        var parentRelation = graph.parentRelations(node);
        var adjoinWayIds = new Array();
        if (parentRelation.length != 0) {
            parentRelation.forEach(function (relation) {
                if (relation.modelName == iD.data.DataType.C_NODECONN) {
                    var from_roadId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
                    var to_roadId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
                    //relations关联的道路现在已经不在结点关联道路列表中，把该关系删除
                    if (!isInArray(newCrossMaatWaysId, from_roadId) || !isInArray(newCrossMaatWaysId, to_roadId)) {
                        //删除对应的crossmaat关联的AssistInfoC和ForbidInfoC拓扑关系
                        var secondRels = graph.parentRelations(relation);
                        secondRels.forEach(function(secondRel){
                            graph = graph.remove(secondRel);
                        })
                        graph = graph.remove(relation);
                    } else if (wayId == from_roadId || wayId == to_roadId) {
                        var fromToWaysArr = [from_roadId, to_roadId];
                        if (!isInArray(adjoinWayIds, fromToWaysArr)) {
                            adjoinWayIds.push(fromToWaysArr);
                        }
                    }
                }
            });
        }
        if (newCrossMaatWaysId) {
            //adjoinWayIds为relations中取出的所有有效关联道路的[from_roadId,to_roadId]
            newCrossMaatWaysId.forEach(function (newWayId) {
                var newFromToWayArr1 = [wayId, newWayId];
                var newFromToWayArr2 = [newWayId, wayId];
                if (wayId == newWayId) {   //！！记得判断是否相同,如果相同只操作一次，对应的是道路到自己的maat
                    if (!isInArray(adjoinWayIds, newFromToWayArr1)) {
                        graph = createNewCrossMaat(graph, wayId, newWayId, nodeId);
                    }
                } else {
                    if (!isInArray(adjoinWayIds, newFromToWayArr1)) {
                        graph = createNewCrossMaat(graph, wayId, newWayId, nodeId);
                    }
                    if (!isInArray(adjoinWayIds, newFromToWayArr2)) {
                        graph = createNewCrossMaat(graph, newWayId, wayId, nodeId);
                    }
                }
            });
        }
        return graph;
    }


    function addCorssMaatForNode(graph, way, node) {
        var isInArray = function (array, element) {
            for (var i in array) {
                if (array[i] == element) {
                    return true;
                }
            }
            return false;
        };
        var nodeParentRelation = graph.parentRelations(node);
        var adjoinWayIds = new Array();
        if (nodeParentRelation.length != 0) {
            nodeParentRelation.forEach(function (relation) {
                if (relation.modelName == iD.data.DataType.C_NODECONN) {
                    var from_roadId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
                    if (!isInArray(adjoinWayIds, from_roadId)) {
                        adjoinWayIds.push(from_roadId);
                    }
                    var to_roadId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
                    if (!isInArray(adjoinWayIds, to_roadId)) {
                        adjoinWayIds.push(to_roadId);
                    }
                }
            });

            for (var i in adjoinWayIds) {
                graph = createNewCrossMaat(graph, adjoinWayIds[i], way.id, node.id);
                graph = createNewCrossMaat(graph, way.id, adjoinWayIds[i], node.id);
            }
        }
        return graph;
    };

    function createNewCrossMaat(graph, sWayId, eWayId, nWayId) {
        var crossMaatMember = [
            {'id': sWayId,  'role': iD.data.RoleType.FROAD_ID,'type': iD.data.GeomType.WAY,'modelName':iD.data.DataType.ROAD},
            {'id': nWayId, 'role': iD.data.RoleType.C_NODE_ID,'type': iD.data.GeomType.NODE,'modelName':iD.data.DataType.C_NODE},
            {'id': eWayId, 'role': iD.data.RoleType.TROAD_ID,'type': iD.data.GeomType.WAY,'modelName':iD.data.DataType.ROAD}
            ];
        // var layers = iD.Layers;
       	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.C_NODECONN);
        var layerId = currentLayer.id;
        var crossMaatRelations = iD.Relation({
            // tags: {'datatype': iD.data.DataType.CROSSMAAT},
            members: crossMaatMember,
            modelName:iD.data.DataType.C_NODECONN,
            identifier:currentLayer.identifier,
            layerId: layerId
        });
        crossMaatRelations.setTags(iD.util.getDefauteTags(crossMaatRelations, currentLayer));
        //var node = graph.entity(nWayId);
        //if(node.tags.mesh&&node.tags.mesh.length>0){
        //    crossMaatRelations = crossMaatRelations.mergeTags({mesh:node.tags.mesh});
        //}

        //新增ACCESSABLE属性字段的更新
        crossMaatRelations = iD.util.tagExtend.updateAcceTagOfCMaat(graph,crossMaatRelations);
        // graph = iD.util.tagExtend.updateAcceTagOfCMaat(graph,crossMaatRelations);

        graph = graph.replace(crossMaatRelations);
        return graph;
    }

    return topoCrossMaat;
}