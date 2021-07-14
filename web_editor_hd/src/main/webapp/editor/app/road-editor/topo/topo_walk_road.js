/**
 * Created by  on 2015/11/12.
 * 计算道路相关操作的步导点与道路的关系"RelWketRoad"
 */
iD.topo.RelWketRoad = function () {

    var topoRelWketRoad = {};
    topoRelWketRoad.roadMerge = function (graph, way, wayA, wayB, rel, midNode, crossNodeM, crossNodeS, crossNodeE) {
        var members=rel.members;
        members.forEach(function(member){
            if(member.id==wayA.id||member.id==wayB.id)
            {
                member.id=way.id;
                rel = rel.updateMember(member, member.index);
            }
        })
        return graph.replace(rel);
    };

    /*道路打断RelWketRoad维护*/
    topoRelWketRoad.break = function (context, graph, way, wayA, wayB, relation) {
        var walkEnterMember = relation.memberByRole(iD.data.RoleType.WALKENTER);
        var highWayMember = relation.memberByRole(iD.data.RoleType.ROAD_ID);
        var walkEnter = graph.entity(walkEnterMember.id);
        var distanceA = iD.util.slopExtend.getDisBetPointAndWay(walkEnter, wayA, graph);
        var distanceB = iD.util.slopExtend.getDisBetPointAndWay(walkEnter, wayB, graph);
        if (distanceA < distanceB) {
            highWayMember.id = wayA.id;
        } else {
            highWayMember.id = wayB.id;
        }
        relation = relation.updateMember(highWayMember, highWayMember.index);
        graph = graph.replace(relation);

        return graph;
    };

    /*道路打断点的RelWketRoad维护
     * 若刚好断点处0.1米范围内存在步导点，且被打断道路为人可走道路（ROAD_LINK::NAVITYPE<>2/3/6/7），
     * 则需要同时建立步导点与新产生的2条车行道路ROAD间的关联关系（REL_WKET_ROAD）*/
    topoRelWketRoad.breakNode = function (graph, node, wayA, wayB, way, context) {
        var navitypeArr = ["0", "1", "4", "5"];    //行人可通行标识
        var navitype = way.tags.navitype;
        var loc = node.loc;
        if (navitypeArr.indexOf(navitype) > -1) {
            var distance = 0.000001, walkEnterArr = [];
            var loc1 = [loc[0] - distance, loc[1] - distance];   //左下角
            var loc2 = [loc[0] + distance, loc[1] + distance];   //右上角
            var bbox = [loc1, loc2];
            var all = context.intersects(bbox);
            all.forEach(function (entity) {
                if (entity instanceof iD.Node && entity.modelName == iD.data.DataType.WALKENTER) {
                    graph = iD.actions.CreateRelWketRoad(entity.id, wayA.id);
                    graph = iD.actions.CreateRelWketRoad(entity.id, wayB.id);
                }
            });
        }
        return graph;
    };

    topoRelWketRoad.breakWalkEnter = function (graph, node, wayA, wayB, way, context) {
        var connectedIDS = walkEnterProcess(node.loc, context);

        function isUniqueRel(node, connectedID) {
            var relations = graph.parentRelations(node);
            for (var i = 0; i < relations.length; i++) {
                var nodeId = relations[i].memberByRole(iD.data.RoleType.WALKENTER).id;
                var roadId = relations[i].memberByRole(iD.data.RoleType.ROAD_ID).id;
                if (node.id == nodeId && connectedID == roadId) {
                    return false;
                }
            }
            return true;
        }

        connectedIDS.forEach(function (connectedID) {
            //graph = iD.actions.CreateRelWketRoad(node.id,connectedID);
            if (isUniqueRel(node, connectedID)) {
                graph = createNewRelWketRoad(graph, node.id, connectedID);
            }
        });
        function walkEnterProcess(loc, context) {
            //判断步导点位置0.1米范围内存在车行道路
            var graph = context.graph();
            var distance = 0.000001, highwaysArr = [];
            var loc1 = [loc[0] - distance, loc[1] - distance];   //左下角
            var loc2 = [loc[0] + distance, loc[1] + distance];   //右上角
            var bbox = [loc1, loc2];
            var all = context.intersects(bbox);
            all.forEach(function (entity) {
                if (entity instanceof iD.Way && entity.modelName == iD.data.DataType.HIGHWAY) {
                    highwaysArr.push(entity);
                }
            });
            var navitypeArr = ["0", "1", "4", "5"];    //行人可通行标识
            //var flag = false;   //标识是否在0.1米范围内存在
            var selectedIDS = [], highlightIDS = [];   //selectedIDS为需要与步导点关联的道路，为行人可通行，highlightIDS需要高亮的行人不可通行的道路
            for (var i = 0; i < highwaysArr.length; i++) {
                var navitype = highwaysArr[i].tags.navitype;
                if (navitypeArr.indexOf(navitype) > -1) {
                    selectedIDS.push(highwaysArr[i].id);
                } else {
                    highlightIDS.push(highwaysArr[i].id);
                }
            }

            if (highwaysArr.length == 0) return [];         //步导打断点附近0.1米内没有道路

            //以下判断打断点附近有道路的情况判断
            if (selectedIDS.length == 0) {
                //都不是行人可通行道路
                //Dialog.confirm("节点连接均为非行人可通行道路，不能关联！",function(){
                //    context.enter(iD.modes.Browse(context));
                //})
                Dialog.alert("节点连接均为非行人可通行道路，不能关联！");
                return [];
            } else if (selectedIDS.length != highwaysArr.length) {     //部分道路为行人可通行
                Dialog.alert("存在非行人可通行道路，只与除其以外的道路关联！")
                context.surface()
                    .selectAll(iD.util.entityOrMemberSelector(highlightIDS, context.graph()))
                    .classed('selected', true);
                return selectedIDS;

            } else {
                //都是行人可通行道路
                return selectedIDS;
            }
        }

        return graph;
    };

    /*道路相交的maat维护*/
    topoRelWketRoad.roadIntersect = function (graph, nodesArr, oldWays) {

        return graph;
    };

    /*道路拓补打断对原先结点entityB和拖动的新结点entityA的maat维护*/
    topoRelWketRoad.topoSplit = function (graph, entityA, entityB, wayId) {
        return graph;
    };

    /*新建道路时，*/
    //  topoRelWketRoad.
    /**新建步导线topo维护 */
    topoRelWketRoad.waklroadCreate = function (graph, walkenterId, entityId) {

        // console.log('maintain road and walkEnter topo')
        function isUniqueRel(node, connectedID) {
            var relations = graph.parentRelations(node);
            // console.log('relations',relations);
            for (var i = 0; i < relations.length; i++) {
                var nodeId = relations[i].memberByRole(iD.data.RoleType.WALKENTER).id;
                var roadId = relations[i].memberByRole(iD.data.RoleType.ROAD_ID).id;
                if (node.id == nodeId && connectedID == roadId) {
                    return false;
                }
            }
            return true;
        }

        function selectElements() {
            editor.context.surface()
                .selectAll(iD.util.entityOrMemberSelector(highLightIds, editor.context.graph()))
                .classed('selected', true);
        }

        var entity = graph.entity(entityId);
        if (entity instanceof iD.Way && entity.modelName == iD.data.DataType.HIGHWAY) {
            if (entity.tags.navitype == '2' || entity.tags.navitype == '3' ||
                entity.tags.navitype == '6' || entity.tags.navitype == '7') {
                Dialog.alert('非行人可通行道路，不能关联！');
            }
            else {
                if (isUniqueRel(editor.context.graph().entity(walkenterId), entityId)) {
                  /*  console.log('walkenterId', walkenterId);
                   console.log('entityId', entityId);
                    console.log('highway and walkenter');*/
                    graph = createNewRelWketRoad(graph, walkenterId, entityId);
                }
            }
        }
        else if (entity instanceof iD.Node) {
            var highWays = graph.parentWays(entity);
            var highLightIds = [];
            highWays.forEach(function (highWay) {
                if (highWay.tags.navitype == '2' || highWay.tags.navitype == '3' ||
                    highWay.tags.navitype == '6' || highWay.tags.navitype == '7') {
                    highLightIds.push(highWay.id);
                }
                else {
                    if (isUniqueRel(editor.context.graph().entity(walkenterId), entityId)) {
                      /*  console.log('walkenterId', walkenterId);
                        console.log('entityId', entityId);
                        console.log('node and walkenter');*/
                        graph = createNewRelWketRoad(graph, walkenterId, highWay.id);
                    }
                }
            })
        }
        if (typeof highLightIds != 'undefined' && highLightIds != '') {
            if (highLightIds.length != 0 && highLightIds.length == highWays.length) {
                Dialog.alert('节点连接均为非行人可通行道路，不能关联！');
            }
            else if (highLightIds.length != 0 && highLightIds.length != highWays.length) {
                Dialog.alert('存在非行人可通行道路，只与除其以外的道路关联！');
                editor.context.map().on('drawn.select', selectElements);
                selectElements();
            }

        }
        return graph;
    }

    topoRelWketRoad.roadCrossEdit = function (graph, node) {
        return graph;
    }

    topoRelWketRoad.crossNodeMerge = function (graph, crossNodeA, crossNodeB) {
        return graph;
    }
    topoRelWketRoad.nodeMerge = function (context,graph, nodeA, nodeB) {
        //return createFullNodeMaat(graph,node.id);
        if(nodeA.isWalkEnter()&&nodeB.isWalkEnter()){
            /*
            graph.parentRelations(nodeA).forEach(function (rel) {
                if (rel.modelName == iD.data.DataType.RELWKETROAD) {
                    var member = rel.memberByRole(iD.data.RoleType.WALKENTER);
                    member.id = nodeB.id;
                    rel = rel.updateMember(member, member.index);
                    graph = graph.replace(rel);
                }
            })*/
            graph=this.nodeMove(context,graph,nodeB);
            return graph;
        }/*else if(nodeA.isWalkEnter()&&nodeB.isRoadNode())
        {
            var relWayIds=getAllWalkEnterRelWayIds(graph,nodeA);
            var parWays=nodeB.getParentWays(graph);
            var createRelWays=[];
            parWays.forEach(function(way){
                if(way.isNaviType()&&-1==relWayIds.indexOf(way.id)){
                    graph=createNewRelWketRoad(graph,nodeA.id,way.id);
                }
            })
            graph=this.nodeMove(context,graph,nodeA);
        }else if(nodeA.isRoadNode())
        {
            graph=this.nodeMove(context,graph,nodeA);
        }*/
        return graph;
    }

    topoRelWketRoad.nodeMove=function(context,graph,node)
    {
        if(node.isWalkEnter())
        {
            var highWays=iD.util.walkExtend().getHighWaysWithFilterBBox(context,0.1,node);
            var highWayIds=[];
            highWays.forEach(function(way){
                if(way.isNaviType())
                {
                    highWayIds.push(way.id);
                }
            });
            var relHighWayIds=[];
            var delRels=[];


            graph.parentRelations(node).forEach(function(rel){
                if(iD.data.DataType.RELWKETROAD==rel.modelName){
                   var roadId=rel.memberByRole(iD.data.RoleType.ROAD_ID).id;
                   if(-1==highWayIds.indexOf(roadId))
                   {
                        delRels.push(rel);
                   }else{
                       highWayIds.splice(highWayIds.indexOf(roadId),1);
                   }
                }
            })
            delRels.forEach(function(rel){
                graph=graph.remove(rel);
            });
            highWayIds.forEach(function(wayid){
                graph=createNewRelWketRoad(graph,node.id,wayid);
            })
        }
        return graph;
    }


    function getAllWalkEnterRelWayIds(graph,node){
        var wayIds=[];
        graph.parentRelations(node).forEach(function(rel){
            if(iD.data.DataType.RELWKETROAD==rel.modelName){
                var roadId=rel.memberByRole(iD.data.RoleType.ROAD_ID).id;
                wayIds.push(roadId);
            }
        });
    }
    function createNewRelWketRoad(graph, walkenterId, highwayId) {
        var Members = [{
            'id': walkenterId,
            'role': "walkenter",
            'type': "WalkEnter"
        }, {
            'id': highwayId,
            'role': "road",
            'type': "Highway"
        }];
        var layers = iD.Layers;
        var currentLayer = layers.getLayer();
        // var currentLayer = layers.getCurrentEnableLayer();
        var relation = iD.Relation({
            // tags: {'datatype': iD.data.DataType.RELWKETROAD},
            identifier:currentLayer.identifier,
            members: Members,
            layerId: currentLayer.id
        });
        graph = graph.replace(relation);
        return graph;
    }
    return topoRelWketRoad;
}
