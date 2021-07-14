/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 17:43:40
 * @Description: ;
 */
iD.actions.CloneWay = function(wayIds,projection,context){
	function calculateNewLoc(rawLoc){
		var pixel = projection(rawLoc);
    	
    	//向上移40px
    	pixel[1] -= 40; 
    	  
    	//像素转经纬度
    	var newLoc = projection.invert(pixel);
    	return newLoc;
	}
	var action = function(graph){
		//多线共享节点的情况暂时不考虑
		wayIds.forEach(function(wayId){
			var survivor = graph.entity(wayId),
				rawNodes = [],
				newNodes = [],
				newWay;

            //生成新的节点
			survivor.nodes.forEach(function(node){
                var nodeEntity = graph.entity(node);
                var _layer = iD.Layers.getLayer(nodeEntity.layerId);
                let newNodeEntity = iD.Node({
						layerId : nodeEntity.layerId,
                        identifier:_layer.identifier,
						loc: calculateNewLoc(nodeEntity.loc), 
						tags: iD.util.tagExtend.updateTaskTag(nodeEntity)
					});
				newNodes.push(newNodeEntity.id);

				graph = graph.replace(newNodeEntity);
			});

			//生成新线
			newWay = iD.Way({
                layerId : survivor.layerId,
                identifier:survivor.identifier,
				nodes : newNodes,
				tags : iD.util.tagExtend.updateTaskTag(survivor)
			});
			// newWay = newWay.mergeTags({src_id: ''});

			graph = graph.replace(newWay);
			graph = iD.actions.MoveLineSplitTuFu(context, newWay)(graph);
		});	

		// if(context.layers().getCurrentEnableLayer().split){
  //           //把新线按照图幅切断
		// 	graph = iD.actions.MoveLineSplitTuFu(context, newWay)(graph);
		// 	return graph;
  //       }else{
            return graph;
  //       }	

	};
	action.disabled = function(){
		return false;
	};
	return action;
}