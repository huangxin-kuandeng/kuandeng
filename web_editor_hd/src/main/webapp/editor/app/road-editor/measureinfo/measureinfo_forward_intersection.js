/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 16:06:22
 * @Description: 
 */
iD.measureinfo.ForwardIntersection = function(){
    var handle = {};
    
    function getParam(opt){
	    let points = [];
	    for(let p of opt.points){
	    	points.push({
	    		trackPointId: p.trackPointId,
	    		trackId: opt.trackId,
		    	x: p.imgOffset.x,
		    	y: p.imgOffset.y
	    	})
	    }
	    var param = iD.measureinfo.getParams({
            method:opt.method,
	    	points: points
	    });
	    return param;
    }

    handle.add = function(graph, entity, opt = {}){
		var currentLayer = iD.measureinfo.getDataLayer(entity);
    	var members = [{
	        'id': entity.id,
	        'modelName': entity.modelName,
	        'role': iD.data.RoleType[entity.modelName + '_ID'],
	        'type': iD.data.GeomType.NODE
	    }];
	    var param = getParam(opt);
	    var relation = iD.Relation({
			modelName: iD.data.DataType.MEASUREINFO,
            members: members,
            identifier:currentLayer.identifier,
            layerId: currentLayer.id,
            tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.MEASUREINFO, currentLayer), {
            	METHOD: 3,
            	PARAMETER: JSON.stringify(param)
            })
		});
		
		graph = graph.replace(relation);
	    return graph;
    }
    
    handle.update = function(graph, entity, opt = {}){
		var currentLayer = iD.measureinfo.getDataLayer(entity);
    	var relation = graph.parentRelations(entity, iD.data.DataType.MEASUREINFO)[0];
    	if(!relation){
    		return graph;
    	}
    	var param = getParam(opt);
    	graph = graph.replace(relation.mergeTags(_.extend({}, iD.util.getDefauteTags(iD.data.DataType.MEASUREINFO, currentLayer), {
        	METHOD: 3,
        	PARAMETER: JSON.stringify(param)
        })));
    	
    	return graph;
    }
    
    handle.remove = function(graph){
        return graph;
    }
    
    return handle;
}