/*
 * @Author: tao.w
 * @Date: 2019-08-15 16:49:36
 * @LastEditors: tao.w
 * @LastEditTime: 2019-09-27 19:12:30
 * @Description: 
 */
/**
 * Created by wt on 2015/8/3.
 */
iD.topo={};
iD.topo.handle = function () {
    var topoEntity = iD.TopoEntity();
    var topoTools = {};
    topoTools[iD.data.DataType.HD_LANE_CONNECTIVITY] = iD.topo.LaneConnectivity();

    topoTools[iD.data.DataType.NODEINFO] = iD.topo.NodeSaat();
    topoTools[iD.data.DataType.NODECONN] = iD.topo.NodeMaat();
    topoTools[iD.data.DataType.C_NODEINFO] = iD.topo.CrossSaat();
    topoTools[iD.data.DataType.C_NODECONN] = iD.topo.CrossMaat();
    topoTools[iD.data.DataType.C_NODECONN] = iD.topo.CrossMaat();
    topoTools[iD.data.DataType.C_NODECONN] = iD.topo.CrossMaat();
    // topoTools[iD.data.DataType.RELWKETROAD] = iD.topo.RelWketRoad();
    // topoTools[iD.data.DataType.WALKZLEVEL] = iD.topo.WalkZlevel();
    topoTools[iD.data.DataType.R_DIVIDER_DREF] = iD.topo.RDividerDref();
    topoTools[iD.data.DataType.DIVIDER_ATTRIBUTE] = iD.topo.DividerAttribute();
    topoTools[iD.data.DataType.LANE_ATTRIBUTE] = iD.topo.LaneAttribute();
    topoTools[iD.data.DataType.DIVIDER_NODE] = iD.topo.DividerNode();
    //topoTools[iD.data.DataType.ROADRULE] = iD.topo.RoadRule();
    var handle = {};
    handle.roadMerge = function (graph, way, wayA, wayB,midNode) {
        var crossNodeM=topoEntity.getRoadCrossByNode(graph,midNode.id);
        var crossNodeS=topoEntity.getRoadCrossByNode(graph,way.nodes[0]);
        var crossNodeE=topoEntity.getRoadCrossByNode(graph,way.nodes[way.nodes.length-1]);
        var parentRelations = graph.parentRelations(wayA);
        parentRelations.forEach(function (relation) {
            if (topoTools[relation.modelName]) {
                graph=topoTools[relation.modelName].roadMerge(graph,way, wayA, wayB, relation,midNode,crossNodeM,crossNodeS,crossNodeE)
            }
        });
        parentRelations = graph.parentRelations(wayB);
        parentRelations.forEach(function (relation) {
            if (topoTools[relation.modelName]) {
                graph=topoTools[relation.modelName].roadMerge(graph,way, wayA, wayB,relation,midNode,crossNodeM,crossNodeS,crossNodeE)
            }
        });
        return graph;
    }

    /*
    * @author:
    * @input param:graph    输入图幅
    *               way：   旧的老路
    *               WayA：  包含开始点的新路
    *               WayB：  包含结束点的新路
    *               node：  打断点
    *               fromDA： 是否来自添加DA时自动打断，保留后半段节点属性
    *
    * */
    handle.break = function (context,graph, way, wayA,wayB,node, fromDA) {
        var parentRelations = graph.parentRelations(way);   
        if(way.modelName == iD.data.DataType.ROAD){
            parentRelations.forEach(function (relation) {
                if (topoTools[relation.modelName]) {
                    graph = topoTools[relation.modelName].break(context,graph, way, wayA, wayB, relation);
                }
            });
            //对新增打断点进行saat和MAAT、REL_WKET_ROAD关系维护
            graph = topoTools[iD.data.DataType.NODEINFO].breakNode(graph, node, wayA, wayB,way,context);
            graph = topoTools[iD.data.DataType.NODECONN].breakNode(graph, node, wayA, wayB,way,context);
            // graph = topoTools[iD.data.DataType.RELWKETROAD].breakNode(graph, node, wayA, wayB,way,context);

        }else if(way.modelName == iD.data.DataType.DIVIDER){
            parentRelations.forEach(function (relation) {
                if (topoTools[relation.modelName]) {
                    graph = topoTools[relation.modelName].break(context,graph, way, wayA, wayB, relation,node);
                }
            });
            graph = topoTools[iD.data.DataType.DIVIDER_NODE].breakNode(graph, node, wayA, wayB,way,context, fromDA);
        }else if(way.modelName == iD.data.DataType.HD_LANE){
            parentRelations.forEach(function (relation) {
                if (topoTools[relation.modelName]) {
                    graph = topoTools[relation.modelName].break(context,graph, way, wayA, wayB, relation,node);
                }
            });
            // 维护topo
            graph = topoTools[iD.data.DataType.HD_LANE_CONNECTIVITY].breakNode(graph, node, wayA, wayB,way,context);
        }
        // else if(way.modelName ==iD.data.DataType.WALKLINK){
        //     graph = topoTools[iD.data.DataType.RELWKETROAD].breakWalkEnter(graph, node, wayA, wayB,way,context);
        // }



        return graph;

    }


    //自动补全一个结点的全部拓补关系
    handle.autoCompleteNodeTopo = function(graph,nodeID){
        for(key in topoTools){
            graph = topoTools[key].autoCompleteNodeTopo(graph, nodeID);
        }
        return graph;
    }


    //oldWays为未相交打断的道路实体数组,nodesArr为相交点实体数组
    handle.roadIntersect = function (graph, nodesArr,oldWays) {
        function isHighWayModel(oldWays){
            for(var i=0;i<oldWays.length;i++){
                if(oldWays[i].modelName !== iD.data.DataType.ROAD){
                    return false
                }
            }
            return true;
        }
        if(isHighWayModel(oldWays)){
            for(key in topoTools){
                graph = topoTools[key].roadIntersect(graph, nodesArr, oldWays);
            }
        }

        return graph;
    }

    /*
    * @author    ：
    * description:实现道路拓补分离
    * input param：graph 输入图幅
    *              entityA 新创建的拖动点实体
    *              entityB 拓补分离点实体
    *              way      选中的待拖动的道路
    * */
    handle.topoSplit = function (graph, entityA, entityB, way) {
        for(var key in topoTools){
            graph = topoTools[key].topoSplit(graph, entityA, entityB, way);
        }

       //graph =iD.topo.CrossMaat().topoSplit(graph, entityA, entityB, way);

       return graph;
    }

    handle.create = function (graph, way) {
    	if(!_.include([iD.data.DataType.ROAD, iD.data.DataType.ROAD_NODE], way.modelName)){
    		return graph;
    	}
        var fromNode = graph.entity(way.nodes[0]);
        var toNode = graph.entity(way.nodes[way.nodes.length-1]);
        var maintainNew =function(node){
            // var a = graph.parentRelations(graph.entity(node.id));
            // console.log("new way topo before");
            // console.log(a.length);
            graph = topoTools[iD.data.DataType.NODEINFO].roadCreate(graph,node.id);
            graph = topoTools[iD.data.DataType.NODECONN].roadCreate(graph,node.id);
            graph = topoTools[iD.data.DataType.C_NODEINFO].roadCreate(graph,node.id);
            graph = topoTools[iD.data.DataType.C_NODEINFO].roadCreate(graph,node.id);
            // var a = graph.parentRelations(graph.entity(node.id));
            // console.log("new way topo after");
            // console.log(a.length);
        }
        maintainNew(fromNode);
        maintainNew(toNode);
        return graph;
    }

    // handle.roadCrossEdit=function(graph,crossNode)
    // {
    //     if(crossNode.members&&crossNode.members.length>0&&crossNode.members[0].id)
    //     {
    //         for(key in topoTools)
    //         {
    //         	let item = topoTools[key];
    //         	if(item && item.roadCrossEdit){
    //         		graph=item.roadCrossEdit(graph,graph.entity(crossNode.members[0].id));
    //         	}
    //         }
    //     }
    //     return graph;
    // }
    handle.roadCrossEdit=function(graph,nodeiD)
    {
        if(nodeiD)
        {
            for(key in topoTools)
            {
            	let item = topoTools[key];
            	if(item && item.roadCrossEdit){
            		graph=item.roadCrossEdit(graph,graph.entity(nodeiD));
            	}
            }
        }
        return graph;
    }
    handle.nodeMerge=function(context,graph,nodeA,nodeB)
    {
        if(nodeA.isRoadNode() && nodeB.isRoadNode())
        {
            var topoEntity = iD.TopoEntity();
            var crossNodeIdA = topoEntity.isInCrossNode(graph,nodeA.id);
            var crossNodeIdB = topoEntity.isInCrossNode(graph,nodeB.id);
            for(var key in topoTools)
            {
                graph=topoTools[key].nodeMerge(context,graph,nodeA,nodeB);
            }
            if(crossNodeIdA&&crossNodeIdB)
            {
                for(var key in topoTools)
                {
                    graph=topoTools[key].crossNodeMerge(graph,graph.entity(crossNodeIdA),graph.entity(crossNodeIdB));
                }

                if(crossNodeIdA==crossNodeIdB)
                {
                    graph=iD.actions.RoadCrossModify([crossNodeIdB,nodeA.id])(graph);
                }else{
                    var crossNodeA=graph.entity(crossNodeIdA);
                    var nodeIds=[];
                    crossNodeA.members.forEach(function(member)
                    {
                        nodeIds.push(member.id);
                    })
                    graph=iD.actions.DeleteNode(crossNodeIdA)(graph);
                    nodeIds.forEach(function(nodeId){
                        graph=iD.actions.RoadCrossModify([crossNodeIdB,nodeId])(graph);
                    })
                }
            }else if(crossNodeIdA)
            {
                //graph=iD.actions.RoadCrossModify(context,[crossNodeIdA,nodeA.id])(graph);
                graph=iD.actions.RoadCrossModify([crossNodeIdA,nodeB.id])(graph);
            }else if(crossNodeIdB)
            {
                graph= this.roadCrossEdit(graph,crossNodeIdB);
            }
        }else{
            for(var key in topoTools)
            {
                graph=topoTools[key].nodeMerge(context, graph,nodeA,nodeB);
            }
        }
        return graph;
    }
    handle.nodeMove=function(context,graph,node)
    {
        for(var key in topoTools)
        {
            graph=topoTools[key].nodeMove(context,graph,node);
        }
        return graph;
    }


    handle.roadModify=function(graph,way){

        return graph;
    }
    handle.changeTags = function(graph, entity, oldTags, changeTags){
        for(var key in topoTools){
            if(!topoTools[key].changeTags) continue ;
            graph=topoTools[key].changeTags(graph, entity, oldTags, changeTags);
        }
        return graph;
    }




    //hadle.br
    return handle;
}