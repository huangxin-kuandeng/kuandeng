/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 16:09:01
 * @Description: 
 */
iD.measureinfo.VirtualLine = function(){
    var handle = {};

    handle.add = function(graph,entity,opt){
    	return graph;
    }

    handle.remove = function(graph){
        return graph;
    }

    handle.update = function(graph,entity,opt){
        return graph;
    }
    
    handle.addEntitys = function(graph, entitys, opt){
        if(!entitys || !entitys.length || !opt){
            return graph;
        }
        var divider = getDivider(entitys);
        if(!divider) return graph;
        var relations = graph.parentRelations(divider, iD.data.DataType.MEASUREINFO);
        if(relations.length){
            return this.update(graph, entitys, opt);
        }
        relation  = createMeasureinfo(graph, entitys);
        if(!relation) return graph;
        
        graph = graph.replace(relation);
        return graph
    }
    
    function getDivider(entitys){
    	var divider;
    	for(let et of entitys){
    		if(et.modelName == iD.data.DataType.DIVIDER){
    			divider = et;
    			break;
    		}
    	}
    	return divider;
    }
    function getNodes(entitys){
    	var nodes = [];
    	for(let et of entitys){
    		if(et.modelName == iD.data.DataType.DIVIDER_NODE){
    			nodes.push(et);
    		}
    	}
    	return nodes;
    }
    
    function createMeasureinfo(graph, entitys, opt) {
        iD.measureinfo.getDataLayer(entitys[0]);
        var currentLayer = iD.measureinfo.getDataLayer(entitys[0]);
        var divider = getDivider(entitys);
        if(!divider) return graph;
        var nodes = getNodes(entitys);
        if(!nodes || !nodes.length) return graph;
        
        var members = [{
            'id': divider.id,
            'modelName': divider.modelName,
            'role': iD.data.Model2Role[divider.modelName],
            'type': iD.data.GeomType.WAY
        }];
        for(let et of nodes){
        	members.push({
	            'id': et.id,
	            'modelName': et.modelName,
	            'role': iD.data.Model2Role[et.modelName],
	            'type': iD.data.GeomType.NODE
	        });
        }

        var relation = iD.Relation({
            modelName: iD.data.DataType.MEASUREINFO,
            members: members,
            layerId: currentLayer.id,
            identifier:currentLayer.identifier,
            tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.MEASUREINFO, currentLayer), {
                METHOD: 2,
                PARAMETER: JSON.stringify(iD.measureinfo.getParams({
                	method: 9
                }))
            })
        });
        
//      console.log('虚拟连接车道线，量测信息：', relation);
//      console.log('数据：' + entitys.length, divider, nodes);
        return relation;
    };

    return handle;
}