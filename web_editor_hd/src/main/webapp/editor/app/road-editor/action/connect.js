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
iD.actions.Connect = function(context,nodeIds) {
    return function(graph) {

        var survivor = graph.entity(_.last(nodeIds));

        //如果当前拖动的要素是【点】，则直接返回，不进行合并
        //因为不允许点进行合并
        if(graph.isPoi(survivor)) return graph;

        // var surDataType = survivor.isRoadNode()||survivor.isWalkEnter(), layer = iD.Layers.getCurrentEnableLayer();

        //过滤关系线
        // function filterParentways(graph, entity){
        // 	var ways = graph.parentWays(entity), r = [];
        // 	for(var i = 0; i<ways.length; i++){
        // 		var way = ways[i];
        // 		if(!way.isOneRoadCrossWay()) r.push(way);
        // 	}
        // 	return r;
        // }
        //合并后处理src_id（只限RoadNode类型）
        //处理规则：
        //1，若均为空，合并后仍为空
        //2，若其中一个存在值，则合并后继承此值
        //3，若两个都存在，则继承连接道路条数多的值；若连接条数一直，使用最大值
       /* var fromEntity = survivor,
            toEntity = graph.entity(_.first(nodeIds)),
            fSrcId = fromEntity.tags['src_id'],
            tSrcId = toEntity.tags['src_id'],
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
        }*/
        
        //公共路口移到线的普通点上（公共路口就是一个路口被多条线连接）
 /*       if(toEntity.modelName === "Highway" && filterParentways(graph,fromEntity).length > 1){
        	useSrcId = fSrcId;
        }*/


            var node = graph.entity(nodeIds[0]);
                //nodeDataType = node.isRoadNode(),
/*            	nodeParents = graph.parentWays(node),isSameRoad = false;
*//*            _.uniq(nodeParents).forEach(function(p){
                if(p.nodes.indexOf(survivor.id) !== -1){
                    isSameRoad = true;
                }
            });*//*
            //后面还得处理，一条线只有两个点，拖动处理和面点的拖动
            //if(isSameRoad) continue;*/

            if(node.modelName == iD.data.DataType.ROAD_NODE){
                /* 导航图层处理
                 1：一条线上将一个点拖到另外一个点上面，如果有一个是个roadnode，则结果是rodenode
                 2：两条线上，一个点拖到另外一个点上面，则结果是四条线
                */
/*                if(!surDataType){
                    continue;
                }*/

                //handle.nodeMerge=function(context,graph,nodeA,nodeB)

                //if()

                if(node.modelName!=survivor.modelName)
                {
                    //graph= iD.topo.handle().nodeMerge(graph,graph.entity(node.id),graph.entity(survivor.id));
                    return graph;
                }
                var idInheritStr="";
                if(survivor.new_id_inherit)
                {
                    idInheritStr=idInheritStr+survivor.new_id_inherit+",";
                }
                if (node.new_id_inherit) {
                    idInheritStr=idInheritStr+node.new_id_inherit+",";
                    //survivor.new_id_inherit = node.new_id_inherit;
                }
                survivor.new_id_inherit =idInheritStr+iD.Entity.id.toOSM(node.id) + '+';
                var parentWays = graph.parentWays(node);
                for(var i = 0;i < parentWays.length;i++){
                    var parent = parentWays[i];
                    if(!parent.isOneRoadCrossWay())
                    {
                        graph = graph.replace(parent.update({tags: iD.util.tagExtend.updateTaskTag(parent)}));
                        graph = graph.replace(parent.replaceNode(node.id, survivor.id));
                    }
                }
                graph= iD.topo.handle().nodeMerge(context,graph,graph.entity(node.id),graph.entity(survivor.id));

            }else{
                graph.parentWays(node).forEach(function(parent) {
                   if (!parent.areAdjacent(node.id, survivor.id)) {
                       survivor.mergeTags(node.tags);//使用survivor替换node的时候，要将node的tags与survivor融合
                       graph = graph.replace(survivor.update({tags: iD.util.tagExtend.updateTaskTag(survivor)}));
                       graph = graph.replace(parent.replaceNode(node.id, survivor.id));
                   }
                });
            }
            if(survivor.modelName == iD.data.DataType.ROAD_NODE){
                survivor = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,survivor);
            }
            
            //两条道路拖拽起/终点 连接道路起终点为行点时，将合并后的行点重置属性。TildenDing
            var defaultTags = iD.util.getDefauteTags(iD.data.DataType.ROAD_NODE, iD.Layers.getLayer(survivor.layerId));
            survivor.tags = defaultTags;
            
            graph = iD.actions.AddEntity(survivor)(graph);
            graph = iD.actions.DeleteNode(node.id)(graph);

        if(graph.parentWays(survivor).length == 0){
            graph = graph.remove(survivor);
        }
    	return graph;
    };
};
