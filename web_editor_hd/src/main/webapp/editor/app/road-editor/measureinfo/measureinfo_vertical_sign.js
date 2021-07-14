/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 16:07:55
 * @Description: 
 */
iD.measureinfo.VerticalSign = function(){
	var handle = {};

    function getParam(opt){
        var param = iD.measureinfo.getParams({
            method:opt.method,
            points: [{
                trackPointId: opt.trackPointId,
                trackId: opt.trackId,
                x: opt.imgOffset.x,
                y: opt.imgOffset.y,
                pointid: opt.pointid,
                pointtype: opt.pointtype
            }]
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
            	METHOD: 1,
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
            METHOD: 1,
            PARAMETER: JSON.stringify(param)
        })));

        return graph;
    }
  	
	return handle;
}