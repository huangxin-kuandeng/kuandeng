iD.actions.RoadIntersect = function (selectIDs, context, lnglat) {
    var modelNameParam = iD.picUtil.getModelNameParam();
    //判断两个线段是否相交
    var getIntersectLoc = function (nodes1, nodes2, graph) {
        var locs = [];
        var lineCal = iD.util.LineCalCulate();
        var interPoint = [0, 0];
        for (var j = 0; j < nodes1.length; j++) {
            if ((j + 1) > (nodes1.length - 1)) break;
            var nodes1_pre = graph.entity(nodes1[j]), nodes1_next = graph.entity(nodes1[j + 1]), pre_arr1 = [nodes1_pre.loc[0], nodes1_pre.loc[1], nodes1_next.loc[0], nodes1_next.loc[1]];
            for (var k = 0; k < nodes2.length; k++) {
                if ((k + 1) > (nodes2.length - 1)) break;
                var nodes2_pre = graph.entity(nodes2[k]), nodes2_next = graph.entity(nodes2[k + 1]), pre_arr2 = [nodes2_pre.loc[0], nodes2_pre.loc[1], nodes2_next.loc[0], nodes2_next.loc[1]];
                var loc = iD.util.lassExtend.SegmentIntersect(pre_arr1, pre_arr2);
                // lineCal.getIntersectionPoint(context.projection,[pre_arr1[0],pre_arr1[1]],[pre_arr1[2],pre_arr1[3]],[pre_arr2[0],pre_arr2[1]],[pre_arr2[2],pre_arr2[3]],interPoint);

                loc && loc.length && (locs.push({
                	loc: loc,
                	index: k
                }));
                //loc && (locs.push(interPoint));
            }
        }
        return locs;
    }

    var hasSameNode = function (wayA, wayB) {
        var wayA_fNode = wayA.nodes[0];
        var wayA_tNode = wayA.nodes[wayA.nodes.length - 1];
        var wayB_fNode = wayB.nodes[0];
        var wayB_tNode = wayB.nodes[wayB.nodes.length - 1];
        if (wayA_fNode == wayB_fNode || wayA_fNode == wayB_tNode || wayA_tNode == wayB_fNode || wayA_tNode == wayB_tNode)
            return true;
        return false;
    }

    //判断是否为两条道路相交打断
     var isHighWayModel = function(wayA, wayB){
        if(wayA.modelName == modelNameParam.DIVIDER&&wayB.modelName == modelNameParam.DIVIDER){
            return true;
        }
        return false;
    }

    //判断是否可通行
    /*var isWalkable =function(way){
        var navitypeArr = ["0","1","4","5"];    //行人可通行标识
        var navitype = way.tags.navitype;
        if(navitypeArr.indexOf(navitype)>-1){
            return true;
        }else{
            return false;
        }
    }

    var selectHWayFromWlink = function(wayA,wayB){
        if(/!*wayA.modelName ==iD.data.DataType.WALKLINK&&*!/wayB.modelName ==modelNameParam.DIVIDER){
            return wayB;
        }else if(wayA.modelName ==modelNameParam.DIVIDER/!*&&wayB.modelName ==iD.data.DataType.WALKLINK*!/){
            return wayA;
        }

        return false;
    }*/


    var action = function (graph) {
        var ways = _.uniq(selectIDs).map(function (id) {
            return graph.entity(id);
        }), locs = [];          //选中道路
        var nodesArr = [];

        for (var i = 0; i < ways.length; i++) {
            for (var j = i + 1; j < ways.length; j++) {
                if (!hasSameNode(ways[i], ways[j])) {
                    var nodes1 = ways[i].nodes, nodes2 = ways[j].nodes, acts = [];
                   // console.warn(ways[i].id + "和" + ways[j].id);
                    var twoWays = [ways[i], ways[j]];
                    (nodes1.length < nodes2.length) && (nodes2 = ways[j].nodes, nodes1 = ways[i].nodes);

                    var locs = getIntersectLoc(nodes1, nodes2, graph), lobj = {}, dis = Infinity, idx, wayNodeIndex;
                    locs.forEach(function (v, ky) {
                        var distance = iD.geo.sphericalDistance(lnglat, v.loc);
                        if (dis > distance) {
                            dis = distance, idx = ky, wayNodeIndex = v.index;
                        }
                    });
                    locs = _.pluck(locs, "loc");
                    if(locs[0]){
                    	// 计算高程
                    	if(wayNodeIndex == null || (wayNodeIndex + 1 > nodes2.length - 1)){
                    	}else {
                    		let n1 = context.entity(nodes2[wayNodeIndex]), n2 = context.entity(nodes2[wayNodeIndex + 1]);
                    		let diff = n1.loc[0] - n2.loc[0], mdiff = n1.loc[0] - lnglat[0];
                    		if(diff == 0){
                    			diff = n1.loc[1] - n2.loc[1];
                    			mdiff = n1.loc[1] - lnglat[1];
                    		}
                    		locs[0][2] = n1.loc[2] + (n1.loc[2] - n2.loc[2]) * (mdiff / diff);
                    	}
                    }
                    var locflag = ((!lnglat && locs[0]) || (idx !== undefined && locs[idx]));
                    if (locs.length !== 0 && locflag && locflag.length >= 2) {
//                      var currLayer = context.layers().getCurrentEnableLayer();
                        var currLayer = iD.Layers.getCurrentModelEnableLayer(modelNameParam.DIVIDER_NODE);
                        var loc = ((!lnglat && locs[0]) || (idx !== undefined && locs[idx])), node = iD.Node({
                            layerId: currLayer.id,
                            identifier: currLayer.identifier,
                            modelName: modelNameParam.DIVIDER_NODE,
                            loc: loc
                        });
                        //var isHighWayModel = isHighWayModel(ways[i],ways[j]);
                        if(isHighWayModel(ways[i],ways[j])){
                            // node = node.mergeTags({modelName: modelNameParam.DIVIDER_NODE});
                            node =  node.mergeTags(iD.util.getDefauteTags(modelNameParam.DIVIDER_NODE, currLayer));
                        }/*else{
                            var way = selectHWayFromWlink(ways[i],ways[j]);
                            if(way&&!isWalkable(way)){
                                Dialog.alert("非行人可通行道路，打断后不能关联！");
                            }
                            // node = node.mergeTags({datatype: iD.data.Constant.WALKENTER});
                        }*/

                        nodesArr.push(node);

                        twoWays.forEach(function (way) {
                            var choice = iD.geo.chooseEdge(graph.childNodes(way), context.projection(loc), context.projection),
                                edge = [way.nodes[choice.index - 1], way.nodes[choice.index]];
                            //context.perform(iD.actions.AddMidpoint({ loc: loc, edge: edge }, node));
                            if(isHighWayModel(ways[i],ways[j])){
                                graph = iD.actions.AddMidpoint({loc: loc, edge: edge}, node)(graph);
                            }/*else if(way.modelName == iD.data.DataType.WALKLINK){
                                graph = iD.actions.AddMidpoint({loc: loc, edge: edge}, node)(graph);
                            }*/
                        });

                        ways = _.uniq(selectIDs).map(function (id) {
                            return graph.entity(id);
                        })
                        //console.log(twoWays);

                        //拓补维护
                        var handle = iD.topo.handle();
                        graph = handle.roadIntersect(graph, [node], ways);
                    }
                }
            }
        }

       // console.log(ways);

        ways.forEach(function (way) {
            var roadNodesArr = [];
            //获得道路上所有新增点
            nodesArr.forEach(function (node) {
                if (way.nodes.indexOf(node.id) >= 0) {
                    roadNodesArr.push(node.id);
                }
            })

            if (roadNodesArr.length > 0) {
                graph = iD.actions.SplitRoad(roadNodesArr, context, way.id)(graph);
            }
        })

        //拓补维护
        var handle = iD.topo.handle();
        graph = handle.roadIntersect(graph, nodesArr, ways);

        //selectIDs = [];
        selectIDs.length = 0;
        return graph;
    };

    action.disabled = function (graph) {
        return false;
    };
    return action;
}