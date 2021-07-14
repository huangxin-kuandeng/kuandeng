/**
 * Created by wt on 2015/8/3.
 */
iD.topo.NodeMaat=function()
{

    var topoNodeMaat={};
    topoNodeMaat.roadMerge=function(graph, way, wayA, wayB, rel,midNode,crossNodeM,crossNodeS,crossNodeE)
    {
        var fromMember = rel.memberByRole(iD.data.RoleType.FROAD_ID);
        var toMember = rel.memberByRole(iD.data.RoleType.TROAD_ID);
        var nodeMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
        if(fromMember&&toMember)
        {
                if(midNode.id!=nodeMember.id)
                {
                    if(fromMember.id==wayA.id||fromMember.id==wayB.id)
                    {
                        fromMember.id=way.id;
                        rel = rel.updateMember(fromMember, fromMember.index);
                        rel.tags = iD.util.tagExtend.updateTaskTag(rel);
                    }
                    if(toMember.id==wayA.id||toMember.id==wayB.id)
                    {
                        toMember.id=way.id;
                        rel = rel.updateMember(toMember, toMember.index);
                        rel.tags = iD.util.tagExtend.updateTaskTag(rel);
                    }
                }
        }
        return graph.replace(rel);
    };


    /*道路打断原先首尾结点Maat的维护*/
    topoNodeMaat.break = function (context,graph, way, wayA, wayB, rel) {
        var fromRoadMember = rel.memberByRole(iD.data.RoleType.FROAD_ID);       // 根据role为from_road获取对应的道路member成员
        var toRoadMember = rel.memberByRole(iD.data.RoleType.TROAD_ID);
        var noadMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);       // 根据node获取对应的道路member成员
        var wayNodesLength = way.nodes.length;

        if(fromRoadMember && noadMember && (noadMember.id == way.nodes[0])&&(fromRoadMember.id == way.id)){
            fromRoadMember.id = wayA.id;
        }else if(fromRoadMember && noadMember && (noadMember.id == way.nodes[wayNodesLength-1])&&(fromRoadMember.id == way.id)){
            fromRoadMember.id = wayB.id;
        };
        rel = rel.updateMember(fromRoadMember, 0);

        if(toRoadMember && noadMember && (noadMember.id == way.nodes[0])&&(toRoadMember.id == way.id)){
            toRoadMember.id = wayA.id;
        }else if(toRoadMember && noadMember && (noadMember.id == way.nodes[wayNodesLength-1])&&(toRoadMember.id == way.id)){
            toRoadMember.id = wayB.id;
        };
        rel = rel.updateMember(toRoadMember, 2);
        rel.tags = iD.util.tagExtend.updateTaskTag(rel);

        graph = graph.replace(rel);
        return graph;
    };

    /*道路打断点的maat维护*/
    topoNodeMaat.breakNode = function (graph, node, wayA, wayB,way,context) {
        graph = createNewMaat(graph,wayA.id,wayB.id,node.id);
        graph = createNewMaat(graph,wayB.id,wayA.id,node.id);
        graph = createNewMaat(graph,wayA.id,wayA.id,node.id);
        graph = createNewMaat(graph,wayB.id,wayB.id,node.id);
        return graph;
    };

    //自动补全一个结点的maat拓补关系
    topoNodeMaat.autoCompleteNodeTopo = function (graph, nodeID) {
        graph = createFullNodeMaat(graph, nodeID);
        return graph;
    }

    /*道路相交的maat维护*/
    topoNodeMaat.roadIntersect = function (graph, nodesArr, oldWays) {
        nodesArr.forEach(function(node){
            graph = createFullNodeMaat(graph,node.id);
        })
        return graph;
    };

    /*道路拓补打断对原先结点entityB和拖动的新结点entityA的maat维护*/
    topoNodeMaat.topoSplit = function (graph, entityA, entityB, wayId) {
        graph = createFullNodeMaat(graph,entityB.id);
        graph = createFullNodeMaat(graph,entityA.id);
        return graph;
    };

    topoNodeMaat.roadCreate = function(graph,nodeId){
    //    graph = addNodeMaatForNode(graph, way, node);
        graph = createFullNodeMaat(graph,nodeId);
        return graph;
    }

    topoNodeMaat.roadCrossEdit=function(graph,node)
    {
        return graph;
    }

    topoNodeMaat.crossNodeMerge=function(graph,crossNodeA,crossNodeB)
    {
        return graph;
    }
    topoNodeMaat.nodeMerge=function(context,graph,nodeA,nodeB)
    {
        if(nodeA.isRoadNode()&&nodeB.isRoadNode())
        {
            //return createFullNodeMaat(graph,node.id);
            graph.parentRelations(nodeA).forEach(function(rel){
                if(rel.modelName==iD.data.DataType.NODECONN)
                {
                    var member = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
                    member.id=nodeB.id;
                    rel = rel.updateMember(member, member.index);
                    graph = graph.replace(rel);
                }
            })
            return createFullNodeMaat(graph,nodeB.id);
        }else{
            return graph;
        }

    }
    topoNodeMaat.nodeMove=function(context,graph,node){
        return graph;
    }

    //
    function createFullNodeMaat(graph,nodeId)
    {
        var connectWays = graph.parentWays(graph.entity(nodeId));      //与点关联的所有的道路
        connectWays.forEach(function(way){
            if(!way.isOneRoadCrossWay()) {
                graph = createFullWayNodeMaat(graph, way.id, nodeId);
            }
        })
        return graph;
    }
   //根据传入的道路和结点进行完整的nodemaat的维护
    function createFullWayNodeMaat(graph,wayId,nodeId){
        var node = graph.entity(nodeId);
        var connectWays = graph.parentWays(node);      //与点关联的所有的道路
        var isInArray = function(array, element){
            if(array&&element){
                for(var i in array){
                    if( array[i].toString() == element.toString()){
                        return true;
                    }
                }
            }
            return false;
        };
        var newNodeMaatWaysId = new Array();        //所有关联道路id数组
        connectWays.forEach(function(connectWay){
            if(!connectWay.isOneRoadCrossWay()){
                newNodeMaatWaysId.push(connectWay.id);
            }
        })
        var parentRelation = graph.parentRelations(node);
        var adjoinWayIds = new Array();
        // if(parentRelation.length!=0){
            parentRelation.forEach(function(relation){
                if(relation.modelName  == iD.data.DataType.NODECONN){
                    var from_roadId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
                    var to_roadId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
                    //relations关联的道路现在已经不在结点关联道路列表中，把该关系删除
                    if(!isInArray(newNodeMaatWaysId,from_roadId)||!isInArray(newNodeMaatWaysId,to_roadId)){
                        //删除对应的maat关联的AssistInfo和ForbidInfo拓扑关系
                        var secondRels = graph.parentRelations(relation);
                        secondRels.forEach(function(secondRel){
                            graph = graph.remove(secondRel);
                        })
                        graph = graph.remove(relation);
                    }else if(wayId == from_roadId ||wayId == to_roadId){
                        var fromToWaysArr = [from_roadId,to_roadId];
                        if(!isInArray(adjoinWayIds,fromToWaysArr)){
                            adjoinWayIds.push(fromToWaysArr);
                        }
                    }
                }
            });

            //adjoinWayIds为relations中取出的所有有效关联道路的[from_roadId,to_roadId]
            newNodeMaatWaysId.forEach(function (newWayId) {
                var newFromToWayArr1 = [wayId,newWayId];
                var newFromToWayArr2 = [newWayId,wayId];
                if(wayId == newWayId){   //！！记得判断是否相同,如果相同只操作一次，对应的是道路到自己的maat
                    if(!isInArray(adjoinWayIds,newFromToWayArr1)){
                        graph = createNewMaat(graph, wayId,newWayId, nodeId);
                    }
                }else{
                    if(!isInArray(adjoinWayIds,newFromToWayArr1)){
                        graph = createNewMaat(graph, wayId,newWayId, nodeId);
                    }
                    if(!isInArray(adjoinWayIds,newFromToWayArr2)){
                        graph = createNewMaat(graph, newWayId, wayId, nodeId);
                    }
                }
            });
        // }
        return graph;
    }

    function addNodeMaatForNode(graph, way, node) {
        var isInArray = function(array, element){
            for(var i in array){
                if( array[i] == element){
                    return true;
                }
            }
            return false;
        };
        var nodeParentRelation = graph.parentRelations(node);
        var adjoinWayIds = new Array();
        if(nodeParentRelation.length!=0){
            nodeParentRelation.forEach(function(relation){
                if(relation.modelName  == iD.data.DataType.NODECONN){
                    var from_roadId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
                    if(!isInArray(adjoinWayIds,from_roadId)){
                        adjoinWayIds.push(from_roadId);
                    }
                    var to_roadId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
                    if(!isInArray(adjoinWayIds,to_roadId)){
                        adjoinWayIds.push(to_roadId);
                    }
                }
            });

            for(var i in adjoinWayIds){
                graph = createNewMaat(graph, adjoinWayIds[i], way.id, node.id);
                graph = createNewMaat(graph, way.id, adjoinWayIds[i], node.id);
            }
        }
        return graph;
    };

    function createNewMaat(graph, sWayId, eWayId, nWayId){
        var nodeMaatMember = [
            {'id': sWayId,  'role': iD.data.RoleType.FROAD_ID,'type': iD.data.GeomType.WAY,'modelName':iD.data.DataType.ROAD},
            {'id': nWayId, 'role': iD.data.RoleType.ROAD_NODE_ID,'type': iD.data.GeomType.NODE,'modelName':iD.data.DataType.ROAD_NODE},
            {'id': eWayId, 'role': iD.data.RoleType.TROAD_ID,'type': iD.data.GeomType.WAY,'modelName':iD.data.DataType.ROAD}
        ];
        // layers = iD.Layers;
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.NODECONN);
        let layerId = currentLayer.id;
        var nodeMaatRelations = iD.Relation({
            tags: iD.util.getDefauteTags(iD.data.DataType.NODECONN, currentLayer),
            modelName: iD.data.DataType.NODECONN,
            members: nodeMaatMember,
            identifier:currentLayer.identifier,
            layerId: layerId
        });

        //增加relation的图幅号mesh属性
        //var node = graph.entity(nWayId);
        //if(node.tags.mesh&&node.tags.mesh.length>0){
        //    nodeMaatRelations = nodeMaatRelations.mergeTags({mesh:node.tags.mesh});
        //}
        //新增 ACCESSABLE属性字段的更新
        nodeMaatRelations = iD.util.tagExtend.updateAcceTagOfNMaat(graph,nodeMaatRelations);
        // graph = iD.util.tagExtend.updateAcceTagOfNMaat(graph,nodeMaatRelations);


        graph = graph.replace(nodeMaatRelations);
        return graph;
    }

    return topoNodeMaat;
}