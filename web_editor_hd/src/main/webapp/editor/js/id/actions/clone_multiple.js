iD.actions.CloneMultiple = function(ids,projection, context, exec) {
	var actions = {
        way: iD.actions.CloneWay,
        roadway: iD.actions.CloneRoadWay
    };
	var action = function(graph){
		//ids中的所有要素肯定在同一图层中
		//所以只需拿第一个要素判断即可
		var firstId = ids[0];
		if(graph.hasEntity(firstId) && exec != 'copy'){
			graph = actions[graph.entity(firstId).type](ids, projection,context)(graph);
		}else if(graph.hasEntity(firstId) && exec == 'copy'){
			graph = actions['roadway'](ids, projection, context)(graph);
		}
        return graph;
	};
	action.disabled = function(){
		return false;
	};
	return action;
};