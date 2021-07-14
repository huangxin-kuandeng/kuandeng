/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 16:36:09
 * @Description: 
 */
iD.actions.CloneRoadWay = function(wayIds, projection, context, entities){

	var action = function(graph){
		// var currLayer = context.layers().getCurrentEnableLayer(),
		var currLayer = context.layers().getLayer(),
		    sharedNIds = {};
		//多线共享节点的情况暂时不考虑
		wayIds.forEach(function(wayId){
			var survivor = graph.entity(wayId),
				rawNodes = [],
				newNodes = [],
				newWay;

			//生成新的节点
			survivor.nodes.forEach(function(node){
				if (!sharedNIds[node]) {
				
					var nodeEntity = graph.entity(node),
						newNodeEntity = iD.Node({
							layerId : currLayer.id,
                            loc: nodeEntity.loc, 
                            identifier: currLayer.identifier,
							tags:iD.util.tagExtend.updateTaskTag(nodeEntity)
						});
						newNodeEntity.setHighway(); //如无属性则会产生坏数据，后台无法处理
					if(survivor.first() === node || survivor.last() === node){
						//newNodeEntity.modelName = "RoadNode";
						newNodeEntity.setRoadNode();
					}
					;
					newNodes.push(newNodeEntity.id);

					graph = graph.replace(newNodeEntity);
					
					sharedNIds[node] = newNodeEntity.id;
				} else {
					graph.entity(sharedNIds[node]).setRoadNode();;
					newNodes.push(sharedNIds[node]);
				}
			});

			//生成新线
			newWay = iD.Way({
                layerId : currLayer.id,
                identifier:currLayer.identifier,
				nodes : newNodes,
				tags : _.clone(survivor.tags)
			});
            //newWay.tags.road_class = "45000";
            newWay.setRoadClass();
			//newWay.setTags(defauteTags(newWay));
            newWay.mergeTags({/*src_id: '',*/FLAG:'2'});
            newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
			graph = graph.replace(newWay);
			graph = iD.actions.MoveLineSplitTuFu(context, newWay)(graph);
			
			entities && (entities.push(newWay.id));
		});		
		
		// if(currLayer.split){
            //把新线按照图幅切断
			// graph = iD.actions.MoveLineSplitTuFu(context, newWay)(graph);
			return graph;
        // }else{
        //     return graph;
        // }
		
	};

	action.disabled = function(){
		return false;
	};
	return action;
}