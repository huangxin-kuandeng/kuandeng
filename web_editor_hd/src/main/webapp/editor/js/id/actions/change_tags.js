iD.actions.ChangeTags = function(entityId, tags) {
    return function(graph) {
        var entity = graph.entity(entityId);
        var lay = iD.Layers.getLayer(entity.layerId);
        if(lay && lay.tagReadOnly){
        	return graph;
        }
        function isUpdateTag(fieldName, value){
        	if(_.isArray(value)){
        		if(value.includes(entity.tags[fieldName])){
        			return !value.includes(tags[fieldName]);
        		}else {
        			return value.includes(tags[fieldName]);
        		}
        	}
			return entity.tags[fieldName] == value && tags[fieldName] != value;
		}
        //当车道线参考线属性设置为0时，删除对应的relation关系
        // modify by Tilden
        if (entity.modelName == iD.data.DataType.DIVIDER) {
            if (isUpdateTag("R_LINE", "1")) {
            	let relationNames = [
            		iD.data.DataType.R_ROAD_DIVIDER,
            		// 交通灯组/参考线 
            		iD.data.DataType.R_DIVIDER_TL,
            		// 车道线组
            		iD.data.DataType.R_DIVIDER_DREF,
            		// 参考线/停止线
            		iD.data.DataType.R_DIVIDER_OPL,
            		// 参考线/人行横道
            		iD.data.DataType.R_DIVIDER_OPG
            	];
            	var flag = false;
            	for(var relName of relationNames){
            		var rels = graph.parentRelations(entity, relName);
	                for(var relation of rels){
	                	flag = true;
	            		graph = iD.actions.DeleteRelation(relation.id)(graph);
	                }
            	}
                if(flag){
                	Dialog.alert('清空参考线上车道线分组，以及关联的关系。', null, null, null, null, {
		                AutoClose: 3
		            });
                }
            }
        }else if(entity.modelName == iD.data.DataType.OBJECT_PL){
        	// 类型不是2，或类型为2子类型不是 停止让行线；
        	if(isUpdateTag("TYPE", "2") || (entity.tags.TYPE == "2" && isUpdateTag("SUBTYPE", ["1", "2", 1, 2]))){
        		var flag = false;
        		var rels = graph.parentRelations(entity, iD.data.DataType.R_DIVIDER_OPL);
                for(var relation of rels){
                	flag = true;
            		graph = iD.actions.DeleteRelation(relation.id)(graph);
                }
                if(flag){
                	Dialog.alert('清空 参考线/停止线 关联关系。', null, null, null, null, {
		                AutoClose: 3
		            });
                }
        	}
        }else if(entity.modelName == iD.data.DataType.OBJECT_PG){
        	// 类型不是3，或类型为3子类型不是 人行横道；
        	if(isUpdateTag("TYPE", "3") || (entity.tags.TYPE == "3" && isUpdateTag("SUBTYPE", "7"))){
        		var flag = false;
        		var rels = graph.parentRelations(entity, iD.data.DataType.R_DIVIDER_OPG);
                for(var relation of rels){
                	flag = true;
            		graph = iD.actions.DeleteRelation(relation.id)(graph);
                }
                if(flag){
                	Dialog.alert('清空 参考线/人行横道 关联关系。', null, null, null, null, {
		                AutoClose: 3
		            });
                }
        	}
        }
        let oldTags = entity.tags;
        graph = graph.replace(entity.update({tags:iD.util.tagExtend.updateTaskTag(entity, tags)}));
        // 车道更改方向时，刷新topo
        if(entity.modelName == iD.data.DataType.HD_LANE){
            graph = iD.topo.handle().changeTags(graph, graph.entity(entity.id), oldTags, tags);
        }else if(entity.modelName == iD.data.DataType.HD_LANE_CONNECTIVITY){
            graph = iD.topo.handle().changeTags(graph, graph.entity(entity.id), oldTags, tags);
        }
        return graph;
    };
};
