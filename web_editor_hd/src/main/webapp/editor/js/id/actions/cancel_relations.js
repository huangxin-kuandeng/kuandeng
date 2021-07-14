/**
 * Created by wangtao on 2017/8/25.
 */
iD.actions.cancelRelations = function(selectedIDs, context) {


    var action = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
            relations = [],ids;
        // if(entity.modelName == iD.data.DataType.DIVIDER || entity.modelName == iD.data.DataType.ROAD){
        //     relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_DREF));
        //     relations.push(...graph.parentRelations(entity,iD.data.DataType.R_ROAD_DIVIDER));
        // }
        if(entity.modelName == iD.data.DataType.DIVIDER ){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_DREF));
        }else if(entity.modelName == iD.data.DataType.ROAD){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_ROAD_DIVIDER));
        }
        var relationNames = [
			// iD.data.DataType.R_ROAD_DIVIDER,
			// 参考线/停止线
			iD.data.DataType.R_DIVIDER_OPL,
			// 参考线/人行横道
			iD.data.DataType.R_DIVIDER_OPG
		];
        relations.forEach(function(rel){
        	if(rel.modelName != iD.data.DataType.R_DIVIDER_DREF){
        		return ;
        	}
        	
        	for(let m of rel.members){
        		let way = context.entity(m.id);
        		if(way.tags.R_LINE == "1"){
        			// 交通灯组/参考线 
        			relations.push(...graph.parentRelations(way, iD.data.DataType.R_DIVIDER_TL));
        		}
        	}
        });
        //TODO 注意重复添加参考线分组，会导致删除车道线关系时重复删除关系报错问题
        if(entity.modelName == iD.data.DataType.DIVIDER){
        	for(let relName of relationNames){
        		relations.push(...graph.parentRelations(entity, relName));
        	}
        }
        ids = _.compact(_.uniq(_.pluck(relations, 'id')));
        if(entity.modelName == iD.data.DataType.DIVIDER){
			//清空车道线分组，埋点
			iD.logger.editElement({
	            'tag': ('delete_'+iD.data.DataType.R_DIVIDER_DREF),
	            'entityId': entity.osmId() || '',
	            'modelName': entity.modelName,
	            'filter': iD.logger.getFilter(entity, context)
	        });
        	// 删除DIVIDER组时，全部清空；
        	ids.forEach(rid=>{
        		graph = iD.actions.DeleteRelation(rid)(graph);
        	});
        	Dialog.alert('清空车道线分组，以及与其关联的关系。', null, null, null, null, {
                AutoClose: 3
            });
        }else {
        	graph = iD.actions.DeleteRelation(ids[0])(graph);
        }
        return graph;
    };

    action.disabled = function(graph) {
        var entity = graph.entity(selectedIDs[0]),
        relations = [];
        //modify by Tilden
        if(entity.modelName == iD.data.DataType.DIVIDER ){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_DIVIDER_DREF));
        }else if(entity.modelName == iD.data.DataType.ROAD){
            relations.push(...graph.parentRelations(entity,iD.data.DataType.R_ROAD_DIVIDER));
        }
        // 偶尔会出现删除关系后再次弹出的菜单中，relations中的id不存在的问题；
        for(let rel of relations){
        	if(!rel || !context.hasEntity(rel.id)){
            	return 'not_eligible';
        	}
        }

        if(relations.length==0){
            return 'not_eligible';
        }
    };
    return action;
};
