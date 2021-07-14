iD.measureinfo={};
iD.measureinfo.getParams = function (opt = {}) {
	var nodes = opt.points || [];
	/*
	 {
	    "trackPointId": "1",
	    "x": "116.374865",
	    "y": "39.975871"
	}
	 * */
	var result = {
	    "Paras": {
	        "method":opt.method,
	        "nodes": nodes
	    }
	}
	
	return result;
}
iD.measureinfo.getDataLayer = function(entity){
    if(!entity || !entity.layerId) return ;
    // iD.data.DataType.MEASUREINFO
    return iD.Layers.getLayer(entity.layerId);
}
/*
iD.measureinfo.updateParams = function(entity){
	// extendInfo可能是字符串类型JSON
	// JSON.parse(str.replace(/}"/g, '}').replace('\"', '"').replace(/":"/, '":'))
	var oldTags = entity.tags.PARAMETER;
}
*/
iD.measureinfo.handle = function () {
    var handels = {};
    handels['forward_intersection'] = iD.measureinfo.ForwardIntersection();
    handels['normal'] = iD.measureinfo.Normal();
    handels['paste'] = iD.measureinfo.Paste();
    handels['verticalsign'] = iD.measureinfo.VerticalSign();
    handels['split'] = iD.measureinfo.Split();
    handels['pan'] = iD.measureinfo.Pan();
    handels['expand_line'] = iD.measureinfo.ExpandLine();
    handels['virtual_line'] = iD.measureinfo.VirtualLine();

    var handle = {};
	
	/**
	 * PARAMETER中method取值
	 * normal: 1,
	 * PLANE（法向量）：2，
	 * forward（前方交会）：3
	 * 没有找到用到 4 的操作
	 * 
	 * paste（灯头黏贴）：5
	 * pan（平移线）：6
	 * expand（扩路）：7
	 * split（打断车道组）：8
	 * 
	 * virtual_line（生成虚拟车道线，直线/弧线）：9
	 * */
	function getHandel(type){
		let keyType = '';
    	if(type == 0){
    		keyType = "normal"
    	}else if(type == 1){
    		keyType = "forward_intersection"
    	}else if(type == 2){
            keyType = "paste"
    	}else if(type == 3) {
			keyType = "verticalsign";
		}else if(type == 4) {
			keyType = "split";
		}else if(type == 5){
			keyType = "expand_line";
		}else if(type == 6){
            keyType = "pan";
		}else if(type == 7){
            keyType = "virtual_line";
        }
    	return handels[keyType];
	}
	
    /**
     *
     * @param graph
     * @param entity
     * @param opt   {type:[0:地平面测量，1:前方交会，2：法量向]}
     */
    handle.addEntity = function(graph, entity, opt = {}){
//  	if(graph.parentRelations(entity, iD.data.DataType.MEASUREINFO).length){
//  		return this.updateEntity(graph, entity, opt);
//  	}
    	let obj = getHandel(opt.type);
    	if(obj) return obj.add(graph, entity, opt);
		return graph;
    }
    
    handle.updateEntity = function(graph, entity, opt = {}){
    	let obj = getHandel(opt.type);
    	if(obj) return obj.update(graph, entity, opt);
		return graph;
    }
	
    handle.remove = function (graph, id, opt = {}) {
    	let entity = graph.entity(id);
		let obj = getHandel(opt.type);
    	if(obj) return obj.update(graph, entity);
    	
    	let relations = graph.parentRelations(entity, iD.data.DataType.MEASUREINFO);
    	for(let rel of relations){
    		graph = graph.remove(rel);
    	}
		return graph;
    }
    
    handle.addEntitys = function(graph, entitys, opt = {}){
    	let obj = getHandel(opt.type);
    	if(obj) return obj.addEntitys && obj.addEntitys(graph, entitys, opt);
		return graph;
    }

    return handle;
}