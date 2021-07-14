// Connect the ways at the given nodes.
//
// The last node will survive. All other nodes will be replaced with
// the surviving node in parent ways, and then removed.
//
// Tags and relation memberships of of non-surviving nodes are merged
// to the survivor.
//
// This is the inverse of `iD.actions.Disconnect`.
//
// Reference:
//   https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/MergeNodesAction.as
//   https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/actions/MergeNodesAction.java
//
iD.actions.Connect = function(nodeIds) {
    return function(graph) {
        /**
    	var survivor = graph.entity(_.last(nodeIds));

        for (var i = 0; i < nodeIds.length - 1; i++) {
            var node = graph.entity(nodeIds[i]);

            graph.parentWays(node).forEach(function(parent) {
                if (!parent.areAdjacent(node.id, survivor.id)) {
                    graph = graph.replace(parent.replaceNode(node.id, survivor.id));
                }
            });

            graph.parentRelations(node).forEach(function(parent) {
                graph = graph.replace(parent.replaceMember(node, survivor));
            });

            survivor = survivor.mergeTags(node.tags);
            graph = iD.actions.DeleteNode(node.id)(graph);
        }

        graph = graph.replace(survivor);*/

    	//nodeIds[0] 目标Id
        //nodeIds[1] 拖动的Id
        var survivor = graph.entity(_.last(nodeIds));

        //如果当前拖动的要素是【点】，则直接返回，不进行合并
        //因为不允许点进行合并
        if(graph.isPoi(survivor)) return graph;

        // var surDataType = survivor.isRoadNode(), layer = iD.Layers.getCurrentEnableLayer();
        var surDataType = survivor.isRoadNode(), layer = iD.Layers.getLayer();

        //过滤关系线
        function filterParentways(graph, entity){
        	var ways = graph.parentWays(entity), r = [];
        	for(var i = 0; i<ways.length; i++){
        		var way = ways[i];
        		if(!way.isOneRoadCrossWay()) r.push(way);
        	}
        	return r;
        }
        //合并后处理src_id（只限RoadNode类型）
        //处理规则：
        //1，若均为空，合并后仍为空
        //2，若其中一个存在值，则合并后继承此值
        //3，若两个都存在，则继承连接道路条数多的值；若连接条数一直，使用最大值
        var fromEntity = survivor,
            toEntity = graph.entity(_.first(nodeIds)),
           /* fSrcId = fromEntity.tags['src_id'],
            tSrcId = toEntity.tags['src_id'],*/
            fSrcId = '',
            tSrcId = '',
            useSrcId = ''; //最终使用的src_id
        if(fromEntity.isRoadNode() && toEntity.isRoadNode()){
            if(_.isEmpty(fSrcId) && _.isEmpty(tSrcId)){
                //使用规则1
                useSrcId = '';
            }else if(!_.isEmpty(fSrcId) && !_.isEmpty(tSrcId)){
                //使用规则3
                var fParentWays = filterParentways(graph,fromEntity).length,
                    tParentWays = filterParentways(graph,toEntity).length;
                if(fParentWays === tParentWays){
                    useSrcId = Math.max(parseInt(fSrcId),parseInt(tSrcId));
                }else{
                    useSrcId = fParentWays > tParentWays ? fSrcId : tSrcId;
                }
            }else{
                //使用规则2
                useSrcId = _.isEmpty(fSrcId) ? tSrcId : fSrcId;
            }
        }
        
        //公共路口移到线的普通点上（公共路口就是一个路口被多条线连接）
        if(toEntity.modelName === "Highway" && filterParentways(graph,fromEntity).length > 1){
        	useSrcId = fSrcId;
        }

        for (var i = 0; i < nodeIds.length - 1; i++) {
            var node = graph.entity(nodeIds[i]), nodeDataType = node.isRoadNode(), 
            	nodeParents = graph.parentWays(node), isSameRoad = false;
            _.uniq(nodeParents).forEach(function(p){
                if(p.nodes.indexOf(survivor.id) !== -1){
                    isSameRoad = true;
                }
            });
            //后面还得处理，一条线只有两个点，拖动处理和面点的拖动
            if(isSameRoad) continue;

            if(layer.isRoad()){
                /* 导航图层处理
                 1：一条线上将一个点拖到另外一个点上面，如果有一个是个roadnode，则结果是rodenode
                 2：两条线上，一个点拖到另外一个点上面，则结果是四条线
                */
                if(!surDataType){
                    //如果拖动的节点不是路口，则肯定是一条道路上的普通点
                    var surParent = graph.parentWays(survivor)[0];
                    var index = surParent.nodes.indexOf(survivor.id);
                    var newNodeIds = surParent.nodes.slice(index);
                    if(nodeDataType){
                        survivor = survivor.mergeTags(node.tags);
                    }else{
                        survivor = survivor.mergeTags.modelName = iD.data.DataType.ROAD_NODE; //({datatype: 'RoadNode'});
                    }
                  //设置母库ID
                  //   survivor = survivor.mergeTags({src_id: ''});
                    survivor.tags = iD.util.tagExtend.updateTaskTag(survivor);
                    graph = graph.replace(survivor);
                    
                    _.uniq(newNodeIds).forEach(function(id){
                        if(id !== survivor.id){
                            surParent = surParent.removeNode(id);
                            surParent.tags = iD.util.tagExtend.updateTaskTag(surParent);
                            graph = graph.replace(surParent);
                        }
                    });
                    let layer = iD.Layers.getLayer(surParent.layerId);
                    var newWay = iD.Way({
                        layerId:surParent.layerId,
                        modelName:surParent.modelEntity,
                        identifier:layer.identifier,
                        tags:iD.util.tagExtend.updateTaskTag(surParent)
                    });
                    ;
                    // newWay = newWay.mergeTags(surParent.tags);
                    graph = graph.replace(newWay);
                    newWay = graph.entity(newWay.id);
                    _.uniq(newNodeIds).forEach(function(id){
                        newWay = newWay.addNode(id);
                        //设置母库ID
                        // newWay = newWay.mergeTags({src_id: ''});
                        graph = graph.replace(newWay);
                    });
                }

                if(!nodeDataType){
                    //被替换的点不是roadNode，则肯定是一条道路线上的普通节点，
                    //他的parentway只能是一条道路线,并且不是第一个和最后一个点
                    var nodeParent = graph.parentWays(node)[0];
                    var isAdjecent = nodeParent.areAdjacent(node.id, survivor.id);
                    var surIndex = nodeParent.nodes.indexOf(survivor.id);
                    
                    //被打断的线母库ID为空[注]一条线的端点落在另一条线的普通点上
                    // nodeParent = nodeParent.mergeTags({src_id: ''});
                    graph = graph.replace(nodeParent);
                    //当前点
                    // survivor = survivor.mergeTags({src_id: useSrcId});
                    graph = graph.replace(survivor);
                    ///////////////////////////////////////////////////////
                    
                    if(surIndex === -1){
                        var index = nodeParent.nodes.indexOf(node.id);
                        var newNodeIds = nodeParent.nodes.slice(index);
                        _.uniq(newNodeIds).forEach(function(id){
                            if(id !== node.id){
                                nodeParent = nodeParent.removeNode(id);
                                graph = graph.replace(nodeParent);
                            }
                        });
                        let _layer = iD.Layers.getLayer(nodeParent.layerId);
                        var newWay = iD.Way({
                            layerId: nodeParent.layerId,
                            identifier:_layer.identifier,
                            modelName:nodeParent.modelName,
                            tags:Object.assign({},nodeParent.tags)
                        });
                        // newWay.layerId = nodeParent.layerId;
                        // newWay = newWay.mergeTags(nodeParent.tags);
                        graph = graph.replace(newWay);
                        newWay = graph.entity(newWay.id);
                        _.uniq(newNodeIds).forEach(function(id){
                            newWay = newWay.addNode(id);
                            graph = graph.replace(newWay);
                        });
                    }
                }

                var parentWays = graph.parentWays(node);
                for(var i = 0;i < parentWays.length;i++){
                   var parent = parentWays[i];
                   graph = graph.replace(parent.replaceNode(node.id, survivor.id));
                }
            }else{
                graph.parentWays(node).forEach(function(parent) {
                   if (!parent.areAdjacent(node.id, survivor.id)) {
                       survivor.mergeTags(node.tags);//使用survivor替换node的时候，要将node的tags与survivor融合
                       graph = graph.replace(parent.replaceNode(node.id, survivor.id));
                   }
                });
            }
            graph = iD.actions.DeleteNode(node.id)(graph);
        }

        //更新src_id
        if(fromEntity.isRoadNode() && toEntity.isRoadNode()){
        	//设置母库ID为空
        	// survivor = survivor.mergeTags({src_id: useSrcId.toString()});
            graph = graph.replace(survivor);
        }

        //合并时，针对线和面要素，如果最后只剩一个点的话，默认删掉
        if(graph.parentWays(survivor).length == 0){
            graph = graph.remove(survivor);
        }
    	return graph;
    };
};
