/**
 * Created by wt on 2015/8/3.
 */
iD.topo.CrossSaat = function () {
    var topoCrossSaat = {};
    topoCrossSaat.roadMerge = function (graph, way, wayA, wayB, rel,midNode,crossNodeM,crossNodeS,crossNodeE) {

    /*    var crossNodeM=topoEntity.isInCrossNode(graph,midNode.id);
        var crossNodeS=topoEntity.isInCrossNode(graph,way.nodes[0]);
        var crossNodeE=topoEntity.isInCrossNode(graph,way.nodes[way.nodes.length-1]);*/
        var nodeMember = rel.memberByRole(iD.data.RoleType.C_NODE_ID);
        if(crossNodeM&&(crossNodeM!=crossNodeS&&crossNodeM!=crossNodeE))
        {
            if(nodeMember.id==crossNodeM.id)
            {
                return graph;
            }
        }

        var flag=false;
        graph.parentRelations(way).forEach(function(wayRel)
        {
            if(wayRel.modelName==iD.data.DataType.C_NODEINFO)
            {
                //var hasMember = wayRel.memberByRole(iD.data.RoleType.ROAD_ID);
                var hasNodeMember = wayRel.memberByRole(iD.data.RoleType.C_NODE_ID);
                if(hasNodeMember.id==nodeMember.id)
                {
                    flag=true;
                }
            }
        })
        if(!flag)
        {
            var member = rel.memberByRole(iD.data.RoleType.ROAD_ID);
            if (member) {
                member.id = way.id;
                rel = rel.updateMember(member, member.index);
                rel.tags = iD.util.tagExtend.updateTaskTag(rel);
            }
        }
        return graph.replace(rel);
    };

    /*道路打断的crosssaat维护 */
    topoCrossSaat.break = function (context,graph, way, wayA, wayB, rel) {
    	let topoEntity = iD.TopoEntity();
        var node = graph.entity(wayB.nodes[0]);  //打断点
        var roadMember = rel.memberByRole(iD.data.RoleType.ROAD_ID);       // 根据role为road获取对应的道路member成员
        var RoadCrossMember = rel.memberByRole(iD.data.RoleType.C_NODE_ID);       // 根据role为node获取对应的道路member成员,类型为CrossRoad
        var roadCrossEntity = graph.entity(RoadCrossMember.id);          //综合交叉点实体
		let cmembers = topoEntity.getCrossNodeMembers(graph, roadCrossEntity.id);
        var nodeMembers = [];
        for (var k = 0; k < (cmembers.length); k++) {
            nodeMembers[k] = cmembers[k].id;
        }
        var wayNodesLength = way.nodes.length;

        if (!(wayNodesLength == 0) && roadMember && nodeMembers) {

            //起始点为综合交叉点内部点5
            if ((!(nodeMembers.indexOf(way.nodes[0]) == -1)) && (roadMember.id == way.id)) {
                roadMember.id = wayA.id;
            }
            //内部道路新增一个crosssaat给终点
            //if ((!(nodeMembers.indexOf(way.nodes[wayNodesLength - 1]) == -1)) && (roadMember.id == wayA.id)) {
            //    graph = createNewSaat(graph, wayB.id, roadCrossEntity.id);
            //}
            //结束点为综合交叉点内部点
            if ((!(nodeMembers.indexOf(way.nodes[wayNodesLength - 1]) == -1)) && (roadMember.id == way.id)) {
                roadMember.id = wayB.id;
            }

            //综合交叉点内部打断拓补逻辑维护，当道路首尾结点都是被综合的点的时候就判定为内部道路
            //if ((!(nodeMembers.indexOf(way.nodes[0]) == -1)) && (!(nodeMembers.indexOf(way.nodes[wayNodesLength - 1]) == -1)) && (roadMember.id == way.id)) {
            //    graph=iD.actions.RoadCrossModify([roadCrossEntity.id,node.id])(graph);
            //}
        }

        rel = rel.updateMember(roadMember, roadMember.index);
        rel.tags = iD.util.tagExtend.updateTaskTag(rel);
        graph = graph.replace(rel);
        return graph;
    };


    //自动补全一个结点的saat拓补关系
    topoCrossSaat.autoCompleteNodeTopo = function (graph, nodeID) {
        graph = createFullCrossSaat(graph, nodeID);
        return graph;
    }

    /*道路相交的crosssaat维护*/
    topoCrossSaat.roadIntersect = function (graph, nodesArr, oldWays) {
        nodesArr.forEach(function(node){
            graph = createFullCrossSaat(graph,node.id);
        })
        return graph;
    };

    /*道路拓补打断对原先结点entityB和拖动的新结点entityA的crosssaat维护*/
    topoCrossSaat.topoSplit = function (graph, entityA, entityB, wayId) {
        graph = createFullCrossSaat(graph, entityB.id);
        graph = createFullCrossSaat(graph, entityA.id);
        return graph;
    }

    topoCrossSaat.roadCreate = function(graph,nodeId){
        graph = createFullCrossSaat(graph,nodeId);
     //   graph = createNewSaat(graph, wayId, nodeId);
        return graph;
    }

    topoCrossSaat.roadCrossEdit=function(graph,node)
    {
        return createFullCrossSaat(graph,node.id);
    }

    topoCrossSaat.crossNodeMerge=function(graph,crossNodeA,crossNodeB)
    {
        if(crossNodeA&&crossNodeB)
        {
            graph.parentRelations(crossNodeA).forEach(function(rel){
                if(rel.modelName==iD.data.DataType.C_NODEINFO)
                {
                    var member = rel.memberByRole(iD.data.RoleType.C_NODE_ID);
                    member.id=crossNodeB.id;
                    rel = rel.updateMember(member, member.index);
                    rel.tags = iD.util.tagExtend.updateTaskTag(rel);
                    graph = graph.replace(rel);
                }
            })
        }
        return graph;
    }

    topoCrossSaat.nodeMerge=function(context,graph,nodeA,nodeB)
    {
        return graph;
    }
    topoCrossSaat.nodeMove=function(context,graph,node){
        return graph;
    }
    //根据结点id更新该结点关联的综合交叉点所有crosssaat拓补关系
    function createFullCrossSaat(graph, nodeId) {
        var isInArray = function (array, element) {
            if(array&&element){
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

        var topoEntity = iD.TopoEntity();
        var crossNodeId = topoEntity.isInCrossNode(graph, nodeId);
        if (crossNodeId != false) {
            var roadCross = graph.entity(crossNodeId);
            // var roadCrossMembers = roadCross.members;
            var roadCrossMembers = topoEntity.getCrossNodeMembers(graph,crossNodeId);
            var innerNodeIds = [];      //获取综合交叉点包含的所有内部点
            var connectWayIDs = new Array();
            roadCrossMembers.forEach(function (member) {
                innerNodeIds.push(member.id);
            });

            //内部结点所关联的道路数组connectWays
            innerNodeIds.forEach(function (innerNodeId) {
                var innerNodeEntity = graph.entity(innerNodeId);
                var ways = graph.parentWays(innerNodeEntity);
                ways.forEach(function (way) {
                    if (!isInArray(connectWayIDs, way.id)) {
                        if (!way.isOneRoadCrossWay()) {
                            connectWayIDs.push(way.id);
                        }
                    }
                })
            })

            //从老的relations中取出所有的关联道路，过滤不存在的道路结点crosssaat
            var parentRelations = graph.parentRelations(roadCross,iD.data.DataType.C_NODEINFO);//获取所有存在的拓补关系
            var oldCrossSaatWayIds = new Array();
            parentRelations.forEach(function (relation) {
                if (relation.modelName == iD.data.DataType.C_NODEINFO) {
                    if (!isInArray(connectWayIDs, relation.memberByRole(iD.data.RoleType.ROAD_ID).id)) {
                        graph = graph.remove(relation);
                    } else {
                        oldCrossSaatWayIds.push(relation.memberByRole(iD.data.RoleType.ROAD_ID).id);
                    }
                }
            });
            //增加新增道路的crosssaat拓补关系
            connectWayIDs.forEach(function (newWayId) {
                if (!isInArray(oldCrossSaatWayIds, newWayId)) {
                    graph = createNewSaat(graph, newWayId, crossNodeId);
                }
            });
            parentRelations = graph.parentRelations(roadCross);//获取所有存在的拓补关系
            parentRelations.forEach(function (relation) {
                if (relation.modelName == iD.data.DataType.C_NODEINFO) {

                    // var nodeMember = relation.memberByRole(iD.data.RoleType.C_NODE_ID);
                    var roadMember = relation.memberByRole(iD.data.RoleType.ROAD_ID);


                    if(isInnerWay(innerNodeIds,graph.entity(roadMember.id)))
                    {
                        relation = relation.mergeTags({INNERARC:"1"});
                        //relation.tags['innerarc']=1;
                        var newWay = graph.entity(roadMember.id);
                        newWay = newWay.mergeTags({FORM_WAY:"2"});
                        newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
                        graph = graph.replace(newWay)
                    }else{
                        relation = relation.mergeTags({INNERARC:"0"});
                        relation.tags = iD.util.tagExtend.updateTaskTag(relation);
                        //relation.tags['innerarc']=0;
                    }
                    graph=graph.replace(relation);
                }
            });

        }
        return graph;

    }

    function createNewSaat (graph, wayId, nodeId)
    {
        var crossSaatMember = [
            {'id': wayId, 'role': iD.data.RoleType.ROAD_ID,'type': iD.data.GeomType.WAY,'modelName':iD.data.DataType.ROAD},
            {'id': nodeId,'role': iD.data.RoleType.C_NODE_ID,'type': iD.data.GeomType.NODE,'modelName':iD.data.DataType.C_NODE}
        ];
        // layers = iD.Layers;
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.C_NODEINFO);
        let layerId = currentLayer.id;
        var crossSaatRelations = iD.Relation({
            modelName:iD.data.DataType.C_NODEINFO,
            tags: iD.util.getDefauteTags(iD.data.DataType.C_NODEINFO, currentLayer),
            members: crossSaatMember,
            identifier:currentLayer.identifier,
            layerId: layerId
        });
        //var node = graph.entity(nodeId);
        //if(node.tags.mesh&&node.tags.mesh.length>0){
        //    crossSaatRelations = crossSaatRelations.mergeTags({mesh:node.tags.mesh});
        //}
        graph = graph.replace(crossSaatRelations);
        return graph;
    };

    return topoCrossSaat;
}